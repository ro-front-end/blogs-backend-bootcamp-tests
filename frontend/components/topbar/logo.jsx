import Link from "next/link";

function Logo({ handleCloseMenu }) {
  return (
    <div>
      <Link onClick={handleCloseMenu} href="/blogs">
        <h2 className="md:text-3xl text-xl  font-bold uppercase">Techy-Blog</h2>
      </Link>
    </div>
  );
}

export default Logo;
