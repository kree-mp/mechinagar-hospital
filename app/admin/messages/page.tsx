"use client";

import { useCallback, useState, memo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  pramukhMessageSchema,
  type PramukhMessageInput,
} from "@/lib/validations/cms";
import PageHeader from "../_components/ui/PageHeader";
import Modal from "../_components/ui/Modal";
import StatusBadge from "../_components/ui/StatusBadge";
import FileUpload from "../_components/ui/FileUpload";
import {
  Field,
  inputCls,
  selectCls,
  textareaCls,
} from "../_components/ui/Field";
import type { PublishStatus } from "@/lib/db/plugins/publishable.plugin";

type PramukhRole = "nagar_pramukh" | "hospital_pramukh";

interface PramukhMessage {
  _id: string;
  role: PramukhRole;
  name: string;
  post: string;
  message: string;
  status: PublishStatus;
  photo: {
    url: string;
    publicId: string;
    format: string;
    bytes: number;
  } | null;
}

const ROLE_ORDER: PramukhRole[] = ["nagar_pramukh", "hospital_pramukh"];

const ROLE_LABELS: Record<PramukhRole, string> = {
  nagar_pramukh: "नगर प्रमुखको सन्देश",
  hospital_pramukh: "अस्पताल प्रमुखको सन्देश",
};

async function fetchMessages(): Promise<PramukhMessage[]> {
  const res = await fetch("/api/cms/pramukh-messages");
  if (!res.ok) throw new Error("Failed to load messages");
  return (await res.json()).messages;
}

// ── Message form ───────────────────────────────────────────────────────────────

const MessageForm = memo(function MessageForm({
  role,
  defaultValues,
  onSubmit,
  loading,
}: {
  role: PramukhRole;
  defaultValues?: Partial<PramukhMessageInput>;
  onSubmit: (data: PramukhMessageInput) => void;
  loading: boolean;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PramukhMessageInput>({
    resolver: zodResolver(pramukhMessageSchema),
    defaultValues: {
      role,
      status: "draft",
      photo: undefined,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Name" required error={errors.name?.message}>
          <input {...register("name")} className={inputCls} placeholder="नाम" />
        </Field>
        <Field label="Post / Designation" required error={errors.post?.message}>
          <input {...register("post")} className={inputCls} placeholder="पद" />
        </Field>
      </div>
      <Field label="Message" required error={errors.message?.message}>
        <textarea
          {...register("message")}
          rows={8}
          className={textareaCls}
          placeholder="सन्देश..."
        />
      </Field>
      <Field label="Status" error={errors.status?.message}>
        <select {...register("status")} className={selectCls}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </Field>
      <Field
        label="Photo"
        required
        error={errors.photo?.message as string | undefined}
      >
        <Controller
          control={control}
          name="photo"
          render={({ field }) => (
            <FileUpload
              value={field.value ?? null}
              onChange={field.onChange}
              accept="image/*"
              folder="mechinagar-messages"
              label="Upload a large, clear photo"
            />
          )}
        />
      </Field>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          {loading && (
            <svg
              className="w-3.5 h-3.5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          Save
        </button>
      </div>
    </form>
  );
});

// ── Role card ────────────────────────────────────────────────────────────────────

const RoleCard = memo(function RoleCard({
  role,
  data,
  onEdit,
}: {
  role: PramukhRole;
  data?: PramukhMessage;
  onEdit: () => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {ROLE_LABELS[role]}
        </span>
        {data && <StatusBadge status={data.status} />}
      </div>
      {data ? (
        <div className="flex items-center gap-3">
          {data.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.photo.url}
              alt=""
              className="w-14 h-14 rounded-lg object-cover border border-gray-200 shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
              <span className="text-sm font-medium text-gray-500">
                {data.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {data.name}
            </p>
            <p className="text-xs text-gray-500 truncate">{data.post}</p>
            <p className="text-xs text-gray-400 truncate mt-0.5">
              {data.message}
            </p>
          </div>
          <button
            onClick={onEdit}
            className="px-3 py-1.5 text-xs font-medium rounded-md text-gray-600 hover:bg-gray-50 border border-gray-200 shrink-0"
          >
            Edit
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">No message set yet.</p>
          <button
            onClick={onEdit}
            className="px-3.5 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Add message
          </button>
        </div>
      )}
    </div>
  );
});

// ── Page ───────────────────────────────────────────────────────────────────────

export default function PramukhMessagesPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<{
    role: PramukhRole;
    data?: PramukhMessage;
  } | null>(null);

  const {
    data: messages = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pramukh-messages"],
    queryFn: fetchMessages,
  });

  const createMessage = useMutation({
    mutationFn: (data: PramukhMessageInput) =>
      fetch("/api/cms/pramukh-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => {
        if (!r.ok)
          return r
            .json()
            .then((d) => Promise.reject(new Error(d.error ?? "Failed")));
        return r.json();
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pramukh-messages"] });
      setModal(null);
    },
  });

  const updateMessage = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<PramukhMessageInput>;
    }) =>
      fetch(`/api/cms/pramukh-messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => {
        if (!r.ok)
          return r
            .json()
            .then((d) => Promise.reject(new Error(d.error ?? "Failed")));
        return r.json();
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pramukh-messages"] });
      setModal(null);
    },
  });

  const handleSubmit = useCallback(
    (data: PramukhMessageInput) => {
      if (modal?.data) {
        updateMessage.mutate({ id: modal.data._id, data });
      } else {
        createMessage.mutate(data);
      }
    },
    [modal, createMessage, updateMessage],
  );

  const mutationError =
    createMessage.error?.message ?? updateMessage.error?.message;

  return (
    <div className="p-6 max-w-3xl">
      <PageHeader
        title="Leadership Messages"
        description="Manage the Nagar Pramukh and Hospital Pramukh messages shown on the homepage"
      />

      {error && (
        <p className="text-sm text-red-500 mb-4">Failed to load messages</p>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {ROLE_ORDER.map((role) => (
            <RoleCard
              key={role}
              role={role}
              data={messages.find((m) => m.role === role)}
              onEdit={() =>
                setModal({ role, data: messages.find((m) => m.role === role) })
              }
            />
          ))}
        </div>
      )}

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.data ? "Edit Message" : "Add Message"}
        size="lg"
      >
        {mutationError && (
          <p className="mb-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {mutationError}
          </p>
        )}
        {modal && (
          <MessageForm
            role={modal.role}
            defaultValues={
              modal.data && {
                ...modal.data,
                photo: modal.data.photo ?? undefined,
              }
            }
            onSubmit={handleSubmit}
            loading={createMessage.isPending || updateMessage.isPending}
          />
        )}
      </Modal>
    </div>
  );
}
