import Link from "next/link";

export default function MainNavigation({}) {
  return (
    <main>
      <section>
        <div>
          <Link href="/">
            <a>logo</a>
          </Link>
        </div>
        <div>
          <Link href="/women">
            <a>WOMEN</a>
          </Link>
        </div>
        <div>
          <Link href="/men">
            <a>MEN</a>
          </Link>
        </div>
        <div>
          <Link href="/kids">
            <a>KIDS</a>
          </Link>
        </div>
        <div>
          <Link href="/baby">
            <a>BABY</a>
          </Link>
        </div>

        <div style={{ textAlign: "right" }}>
          <Link href="/baby">
            <a>BABY</a>
          </Link>
        </div>
      </section>
    </main>
  );
}
