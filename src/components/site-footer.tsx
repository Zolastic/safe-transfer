import Link from "next/link";
import React from "react";

const SiteFooter = () => {
  return (
    <footer className="mx-auto flex items-center justify-center bg-transparent py-6">
      <div className="container flex flex-col items-center justify-between gap-4">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
          Designed and built by{" "}
          <Link
            href="https://www.nhattien.tech/"
            target="_blank"
            className="text-slate-800/60 underline underline-offset-4"
          >
            Ho Nhat Tien
          </Link>{" "}
          © 2024
        </p>
      </div>
    </footer>
  );
};

export default SiteFooter;
