import mongoose, { Schema, Model, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'superadmin' | 'admin' | 'editor';

export interface IRefreshToken {
  tokenHash: string;
  createdAt: Date;
  expiresAt: Date;
  ip: string;
  userAgent: string;
}

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  blacklisted: boolean;
  failedLoginAttempts: number;
  lockedUntil: Date | null;
  passwordChangedAt: Date | null;
  lastLoginAt: Date | null;
  refreshTokens: IRefreshToken[];
  createdAt: Date;
  updatedAt: Date;
  // instance methods
  comparePassword(plain: string): Promise<boolean>;
  isLocked(): boolean;
  incrementFailedAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
  addRefreshToken(token: IRefreshToken): Promise<void>;
  revokeRefreshToken(tokenHash: string): Promise<void>;
  wasPasswordChangedAfter(jwtIssuedAt: number): boolean;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    tokenHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ['superadmin', 'admin', 'editor'] as UserRole[],
        message: '"{VALUE}" is not a valid role',
      },
      default: 'editor',
    },
    isActive: { type: Boolean, default: true, index: true },
    blacklisted: { type: Boolean, default: false, index: true },
    failedLoginAttempts: { type: Number, default: 0, min: 0, select: false },
    lockedUntil: { type: Date, default: null, select: false },
    passwordChangedAt: { type: Date, default: null, select: false },
    lastLoginAt: { type: Date, default: null },
    refreshTokens: {
      type: [refreshTokenSchema],
      default: [],
      select: false,
      validate: {
        validator: (arr: IRefreshToken[]) => arr.length <= 10,
        message: 'Cannot exceed 10 concurrent sessions per user',
      },
    },
  },
  { timestamps: true }
);

// Hash password on create or change
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
  // Offset by 1s so JWTs issued just before change are still caught
  if (!this.isNew) this.passwordChangedAt = new Date(Date.now() - 1000);
});

// Keep only the 5 most recent sessions
userSchema.pre('save', function () {
  if (this.refreshTokens?.length > 5) {
    this.refreshTokens = this.refreshTokens.slice(-5);
  }
});

userSchema.methods.comparePassword = async function (plain: string): Promise<boolean> {
  return bcrypt.compare(plain, this.password);
};

userSchema.methods.isLocked = function (): boolean {
  return !!(this.lockedUntil && this.lockedUntil > new Date());
};

userSchema.methods.incrementFailedAttempts = async function (): Promise<void> {
  this.failedLoginAttempts += 1;
  if (this.failedLoginAttempts >= 5) {
    this.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30-minute lockout
    this.failedLoginAttempts = 0;
  }
  await this.save({ validateModifiedOnly: true });
};

userSchema.methods.resetLoginAttempts = async function (): Promise<void> {
  this.failedLoginAttempts = 0;
  this.lockedUntil = null;
  this.lastLoginAt = new Date();
  await this.save({ validateModifiedOnly: true });
};

userSchema.methods.addRefreshToken = async function (token: IRefreshToken): Promise<void> {
  this.refreshTokens.push(token);
  await this.save({ validateModifiedOnly: true });
};

userSchema.methods.revokeRefreshToken = async function (tokenHash: string): Promise<void> {
  this.refreshTokens = this.refreshTokens.filter(
    (t: IRefreshToken) => t.tokenHash !== tokenHash
  );
  await this.save({ validateModifiedOnly: true });
};

// Returns true if password changed AFTER the JWT was issued (forces re-login)
userSchema.methods.wasPasswordChangedAfter = function (jwtIssuedAt: number): boolean {
  if (!this.passwordChangedAt) return false;
  return Math.floor(this.passwordChangedAt.getTime() / 1000) > jwtIssuedAt;
};

export const User = (mongoose.models.User ??
  mongoose.model<IUser>('User', userSchema)) as Model<IUser>;
