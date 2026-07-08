import { useState } from 'react';

interface CopyLinkButtonProps {
  /** The full shareable room URL. */
  url: string;
}

/** Copies the room URL to the clipboard and shows brief confirmation. */
export function CopyLinkButton({ url }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      className="btn btn--ghost copy-link"
      type="button"
      onClick={handleCopy}
      aria-label="Copy room link"
    >
      {copied ? '✔ Copied' : '⧉ Copy link'}
    </button>
  );
}
