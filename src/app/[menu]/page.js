import { apiGet } from "@/handlers/apiHandler";

import { MenuAccordion } from "./MenuAccordion";
import { ItemAdded } from "./ItemAdded";
import { BreadCrumb } from "./Breadcrumb";
import { Gallery } from "./Gallery";
import { Header } from "./Header";
import { Call } from "./Call";
import { Footer } from "./Footer";
import { Details } from "./Details";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }, parent) {
  const outletPromis = apiGet(`/api/shop/outlet/${params.menu}`);

  const response = await Promise.all([
    outletPromis,
  ]);
  const outlet = response[0]
  if (outlet.status === 404) notFound()

  return {
    title: outlet.name,
    openGraph: {
      images: [ outlet.logo, ...outlet?.gallery],
    },
  }
}

export default async function Home({ params }) {
  const itemsPromis = apiGet(`/api/shop/menu/${params.menu}`);
  const outletPromis = apiGet(`/api/shop/outlet/${params.menu}`);

  const [items, outlet] = await Promise.all([
    itemsPromis,
    outletPromis,
  ]);
  if (items.status === 404) notFound()
  if (outlet.status === 404) notFound()

  return (
    <>
      <main className="flex w-full min-h-screen flex-col gap-4 justify-evenly p-6 overflow-hidden bg-white">
        {/* Header */}
        <Header />
        {/* Breadcrumb */}
        <BreadCrumb params={params} />
        {/* Outlet Image */}
        <Gallery outlet={outlet} />
        {/* Restaurant Details */}
        <Details outlet={outlet} />
        {/* Call Waiter, Bookmark, Share */}
        <Call />
        {/* Menu and Filters */}
        <MenuAccordion items={items} outlet={outlet} />
        {/* Item Added */}
        <ItemAdded params={params} />
      </main>
      <Footer outlet={outlet} />
    </>
  );
}
