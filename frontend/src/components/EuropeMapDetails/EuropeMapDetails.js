import { useContext, useMemo, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

import BzPriceContext from "../../store/BzPriceContext";
import VATContext from "../../store/VATContext";
import { countryList } from "../../components/countryList";
import VatToggle from "../../components/VatToggle/VatToggle";

import BiddingZoneList from "../BiddingZoneList";

import Country from "./Country";
import DateSelector from "../DateSelector/DateSelector";
import css from "./EuropeMapDetails.module.css";

const coreRowModel = getCoreRowModel();
const sortedRowModel = getSortedRowModel();

function EuropeMapDetails() {
  const { t } = useTranslation();
  const bzPriceCtx = useContext(BzPriceContext);
  const vatCtx = useContext(VATContext);
  const biddingZoneList = useMemo(() => BiddingZoneList(), []);

  const [sorting, setSorting] = useState([
    { id: "name", desc: false },
  ]);

  const data = useMemo(() => {
    const countries = biddingZoneList.reduce((previous, zone) => {
      if (
        zone.bz in bzPriceCtx.bzPrice &&
        bzPriceCtx.bzPrice[zone.bz].length > 0
      ) {
        let resolution = "PT60M";
        if (bzPriceCtx.bzPrice[zone.bz].length > 24) {
          resolution = "PT15M";
        }
        const finalPrice = bzPriceCtx.bzPrice[zone.bz].reduce(
          (previous, bz) =>
            bz.resolution === resolution
              ? {
                  sum: previous.sum + bz.price,
                  elements: previous.elements + 1,
                }
              : previous,
          { sum: 0, elements: 0 }
        );
        if (finalPrice.elements > 0) {
          if (!(zone.country in previous)) {
            previous[zone.country] = [];
          }
          previous[zone.country].push({
            biddingZone: zone.bz,
            description: zone.description,
            averagePrice: finalPrice.sum / finalPrice.elements,
            vat: vatCtx.vat ? countryList[zone.country].vat : 0,
          });
        }
      }
      return previous;
    }, {});

    const rows = [];
    for (const countryName of Object.keys(countries)) {
      const zones = countries[countryName];
      const translatedName = t(`countries.${countryName}`, countryName);
      const avgPrice =
        zones.length === 1
          ? zones[0].averagePrice
          : zones.reduce((sum, z) => sum + z.averagePrice, 0) / zones.length;
      const vat = zones[0].vat;
      rows.push({
        name: countryName,
        translatedName,
        zones,
        avgPrice,
        vat,
      });
    }
    return rows;
  }, [biddingZoneList, bzPriceCtx.bzPrice, vatCtx.vat, t]);

  const columns = useMemo(
    () => [
      {
        id: "name",
        header: t("europeMapDetails.country"),
        accessorFn: (row) => row.translatedName,
        sortingFn: "text",
      },
      {
        id: "price",
        header: t("europeMapDetails.priceUnit"),
        accessorFn: (row) => row.avgPrice,
        sortingFn: "basic",
      },
      {
        id: "vat",
        header: t("europeMapDetails.vat"),
        accessorFn: (row) => row.vat,
        sortingFn: "basic",
      },
    ],
    [t]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: coreRowModel,
    getSortedRowModel: sortedRowModel,
  });

  const sortedRows = table.getRowModel().rows;

  return (
    <section>
      <h1>{t("europeMapDetails.title")}</h1>
      <p className={css.description}>
        <Trans i18nKey="europeMapDetails.description" components={{ b: <b /> }} />
      </p>
      <div className={css.actionContainer}>
        <div className={css.vatSelector}>
          <VatToggle />
        </div>
        <div className={css.dateSelector}>
          <DateSelector />
        </div>
      </div>
      {sortedRows.length === 0 && (
        <Trans i18nKey="europeMapDetails.noPricesAvailable" components={{ b: <b /> }} />
      )}
      {sortedRows.length > 0 && (
        <div className={css.priceContainer}>
          <div className={`${css.country} ${css.header}`}>
            {table.getHeaderGroups().map((headerGroup) =>
              headerGroup.headers.map((header) => {
                const sortDir = header.column.getIsSorted();
                const indicator = sortDir === "asc" ? " ▲" : sortDir === "desc" ? " ▼" : "";
                return (
                  <div
                    key={header.id}
                    className={`${css[header.id]} ${css.sortableHeader}`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.column.columnDef.header}
                    {indicator && <span className={css.sortIndicator}>{indicator}</span>}
                  </div>
                );
              })
            )}
          </div>
          {sortedRows.map((row, index) => (
            <Country
              key={row.original.name}
              first={index === 0}
              name={row.original.name}
              country={row.original.zones}
              priceLevelVAT={vatCtx.vat ? 1.21 : 1}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default EuropeMapDetails;
