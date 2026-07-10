import ListingForm from "@/components/listings/ListingForm";

export default function ListSpacePage() {
  return (
    <main
      className="
        min-h-screen
        bg-[#050816]
        text-white
        px-6
        py-10
      "
    >

      <div
        className="
          max-w-3xl
          mx-auto
        "
      >

        <h1
          className="
            text-4xl
            font-bold
            mb-3
          "
        >
          Create Listing
        </h1>


        <p
          className="
            text-white/60
            mb-8
          "
        >
          Add your visibility space to Adspheria marketplace.
        </p>


        <ListingForm />

      </div>

    </main>
  );
}
