"use client";

type ReviewActionsProps = {
  articleId: number;
  onApprove: (id: number) => void;
  onRequestRevision: (id: number) => void;
};

export default function ReviewActions({ articleId, onApprove, onRequestRevision }: ReviewActionsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => onApprove(articleId)}
        className="rounded-full bg-amber-700 px-4 py-2 text-sm font-semibold text-white"
      >
        Approve
      </button>
      <button
        type="button"
        onClick={() => onRequestRevision(articleId)}
        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
      >
        Request revision
      </button>
    </div>
  );
}
