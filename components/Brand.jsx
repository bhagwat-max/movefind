import Link from 'next/link';

export default function Brand() {
  return <Link className="brand" href="/" aria-label="MoveFind home">
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 32 32" width="25" height="25" fill="none"><rect x="3" y="4" width="26" height="24" rx="8" fill="currentColor"/><path d="m13 10 10 6-10 6V10Z" fill="#fff"/><circle cx="8" cy="9" r="1.2" fill="#fff" opacity=".75"/><circle cx="8" cy="23" r="1.2" fill="#fff" opacity=".75"/></svg>
    </span>
    <span className="brand-name">move<span>find</span><span className="brand-dot">.</span></span>
  </Link>;
}
