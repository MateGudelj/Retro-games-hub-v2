
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-800 border-b border-slate-700">
        <div className="container px-4 sm:px-8 lg:px-16 mx-auto">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter text-slate-100 sm:text-5xl xl:text-6xl/none">
                  Rediscover the Classics. Preserve history.
                </h1>
                <p className="max-w-[600px] text-slate-400 md:text-xl">
                  Welcome to Retro Gaming Hub, the ultimate hub for enthusiasts of pixel-perfect classics and timeless gameplay. Whether you&apos;re here to discuss legendary strategies, trade rare cartridges in our marketplace, or stay up-to-date with the latest news and mods, you&apos;ve found your community.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-indigo-600 px-8 text-sm font-medium text-slate-50 shadow transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-800"
                  href="/forum"
                >
                  Join the Community
                </Link>
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 px-8 text-sm font-medium text-slate-50 shadow-sm transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-600"
                  href="/forum/marketplace"
                >
                  Explore the Marketplace
                </Link>
              </div>
            </div>
            
            <Image
              alt="The Altar of Classics"
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              height="550"
              src="/images/Console_collection3.jpg"
              width="550"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 sm:px-8 lg:px-16 mx-auto space-y-12">
          {/* Feature 1: The Forum */}
          <div className="mx-auto grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter text-slate-100 sm:text-4xl">Connect with a Passionate Community</h2>
              <p className="max-w-[600px] text-slate-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Dive into our forums to share your favorite gaming memories, ask for help on that one impossible level, or show off your carefully curated collection. From general discussions to in-depth game reviews, there&apos;s a conversation waiting for you.
              </p>
              <Link className="text-blue-400 hover:underline" href="/forum">Jump into the Discussion →</Link>
            </div>
            
            <Image
              alt="RGH Community"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              height="310"
              src="/images/FGC_Community.webp"
              width="550"
            />
          </div>

          {/* Feature 2: The Marketplace */}
          <div className="mx-auto grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
            
            <Image
              alt="The Rare Find"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
              height="310"
              src="/images/Gold_zelda3.webp"
              width="500"
            />
            <div className="flex flex-col justify-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter text-slate-100 sm:text-4xl">Trade, Sell, and Discover Treasures</h2>
              <p className="max-w-[600px] text-slate-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our user-powered marketplace is the perfect place to find that missing piece for your collection or sell your spare classics to another enthusiast. With a powerful tag-based filtering system, you can easily hunt for specific consoles, games, and accessories.
              </p>
              <Link className="text-blue-400 hover:underline" href="/forum/marketplace">Browse the Marketplace →</Link>
            </div>
          </div>
          
           {/* Feature 3: The Blog/Guides */}
           <div className="mx-auto grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter text-slate-100 sm:text-4xl">Master the Classics. Stay Informed.</h2>
              <p className="max-w-[600px] text-slate-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our blog is your source for the latest retro gaming news, in-depth guides, and hardware modding tutorials. Whether you&apos;re looking for pixel-perfect strategies or a deep dive into the tech that powered a generation, our articles have you covered.
              </p>
              <Link className="text-blue-400 hover:underline" href="/blog">Read Our Latest Articles →</Link>
            </div>
            
            <Image
              alt="The Strategy Guide"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              height="310"
              src="/images/COD_guide.png"
              width="550"
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-800 border-t border-slate-700">
        <div className="container mx-auto grid items-center justify-center gap-4 px-4 sm:px-8 lg:px-16 text-center">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter text-slate-100 md:text-4xl/tight">
              Your Adventure Awaits.
            </h2>
            <p className="mx-auto max-w-[600px] text-slate-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Create your free account to start posting, replying, and building your legacy in the RetroForge community.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
            <Link
              className="inline-flex h-10 items-center justify-center rounded-lg bg-indigo-600 px-8 text-sm font-medium text-slate-50 shadow transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-800"
              href="/api/auth/signin"
            >
              Sign Up for Free
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

