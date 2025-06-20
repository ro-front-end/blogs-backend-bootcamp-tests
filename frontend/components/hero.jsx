import Image from "next/image";
import Link from "next/link";

function Hero() {
  return (
    <section className="bg-gradient-to-b from-slate-950 to-cyan-950 w-full min-h-[94vh] relative flex items-center justify-center px-4 rounded-full bg-opacity-10 ">
      <div className="absolute inset-0 overflow-hidden z-0 blur-md">
        <Image
          src="/cover-image.png"
          alt="Fondo decorativo"
          fill
          className="object-cover opacity-80"
        />
      </div>

      <div className="z-10 text-center max-w-xl ">
        <h1 className="text-4xl md:text-6xl bg-black p-6 bg-opacity-90 rounded-2xl font-bold text-white mb-6 uppercase">
          TECHY-BLOG
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8">
          Everything about the tech world!
        </p>
        <Link
          href="/blogs"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 ease-in-out shadow-lg hover:shadow-xl"
          aria-label="Go to blogs"
        >
          Enter Techy-Blog
        </Link>
      </div>
    </section>
  );
}

export default Hero;
