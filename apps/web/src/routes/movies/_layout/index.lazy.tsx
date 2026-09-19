import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/movies/_layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  const data = Route.useLoaderData();

  return (
    <article className="w-full p-6 rounded-3xl bg-[#ffebcd]">
      {/* Breadcrumbs (?) */}

      {/* Two columns */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        {/* Cover */}
        <div>
          <img
            src="https://picsum.photos/580/500"
            height={500}
            width={580}
            alt="movie cover"
            className="rounded-2xl"
          />
        </div>

        {/* Movie info */}
        <div className="w-full flex flex-col gap-3">
          <h1>{data.title}</h1>
          <p>{data.description}</p>
          <div>
            <p>{data.releaseYear}</p>
            <p>{data.rating}</p>
            <p>{data.duration}</p>
            <p>{data.listed}In</p>
          </div>
        </div>
      </section>

      {/* Cast Carousel */}

      {/* Bento Grid: Movie Genres */}
    </article>
  );
}
