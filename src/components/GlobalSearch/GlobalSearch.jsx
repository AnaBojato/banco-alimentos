import { useMemo, useState } from "react";

import {
  Search,
  Users,
  LayoutDashboard,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./globalSearch.css";

function GlobalSearch({
  usuarios = [],
}) {

  const navigate = useNavigate();

  const [query, setQuery] =
    useState("");

  const [open, setOpen] =
    useState(false);

  const staticPages = [
    {
      id: "inicio-page",
      label: "Inicio",
      route: "/inicio",
      icon: <LayoutDashboard size={16} />,
    },

    {
      id: "usuarios-page",
      label: "Usuarios",
      route: "/usuarios",
      icon: <Users size={16} />,
    },
  ];

  const usuariosResults =
    usuarios.map((usuario) => ({
      id: `usuario-${usuario.id}`,

      label:
        usuario.nombre_completo,

      sub:
        usuario.correo,

      route: "/usuarios",

      icon: <Users size={16} />,
    }));

  const allResults = [
    ...staticPages,
    ...usuariosResults,
  ];

  const filteredResults =
    useMemo(() => {

      if (!query.trim())
        return [];

      return allResults.filter(
        (item) =>
          item.label
            ?.toLowerCase()
            .includes(
              query.toLowerCase()
            ) ||

          item.sub
            ?.toLowerCase()
            .includes(
              query.toLowerCase()
            )
      );

    }, [query, usuarios]);

  const handleSelect = (
    result
  ) => {

    navigate(
      `${result.route}?highlight=${result.id}`
    );

    setOpen(false);

    setQuery("");

  };

  return (

    <div className="global-search">

      <div className="search-wrapper">

        <Search
          size={16}
          className="search-icon"
        />

        <input
          type="text"
          placeholder="Buscar registros..."
          className="search-input"

          value={query}

          onFocus={() =>
            setOpen(true)
          }

          onChange={(e) =>
            setQuery(
              e.target.value
            )
          }
        />

      </div>

      {open &&
        filteredResults.length > 0 && (

        <div className="search-dropdown">

          {filteredResults.map(
            (result) => (

            <button
              key={result.id}
              className="search-result"

              onClick={() =>
                handleSelect(
                  result
                )
              }
            >

              <div className="search-result-icon">
                {result.icon}
              </div>

              <div className="search-result-info">

                <span className="search-result-title">
                  {result.label}
                </span>

                {result.sub && (
                  <span className="search-result-sub">
                    {result.sub}
                  </span>
                )}

              </div>

            </button>

          ))}

        </div>

      )}

    </div>

  );
}

export default GlobalSearch;