import {
  Bell,
  CircleHelp,
  Menu,
  Search,
  Users,
  House,
  Truck,
  Package,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import "../Navbar/navbar.css";

function Navbar({
  openSidebar,
  children,
}) {

  const navigate = useNavigate();

  const location = useLocation();

  const searchRef = useRef(null);

  const [search, setSearch] =
    useState("");

  const [results, setResults] =
    useState([]);

  const [showResults, setShowResults] =
    useState(false);

  // ============================================
  // REGISTROS DEL SISTEMA
  // ============================================

  const searchData = [
    {
      title: "Inicio",
      description:
        "Panel principal del sistema",
      route: "/inicio",
      icon: <House size={16} />,
      keywords: [
        "inicio",
        "dashboard",
        "panel",
      ],
    },

    {
      title: "Usuarios",
      description:
        "Administradores y voluntarios",
      route: "/usuarios",
      icon: <Users size={16} />,
      keywords: [
        "usuarios",
        "admin",
        "voluntarios",
        "personal",
      ],
    },

    {
      title: "Inventario",
      description:
        "Productos y stock",
      route: "/inventario",
      icon: <Package size={16} />,
      keywords: [
        "inventario",
        "productos",
        "stock",
      ],
    },

    {
      title: "Entregas",
      description:
        "Control de entregas",
      route: "/entregas",
      icon: <Truck size={16} />,
      keywords: [
        "entregas",
        "beneficiarios",
      ],
    },
  ];

  // ============================================
  // BUSCADOR
  // ============================================

  useEffect(() => {

    if (!search.trim()) {

      setResults([]);

      return;

    }

    const filtered =
      searchData.filter((item) => {

        const text =
          `${item.title} ${item.description} ${item.keywords.join(" ")}`.toLowerCase();

        return text.includes(
          search.toLowerCase()
        );

      });

    setResults(filtered);

  }, [search]);

  // ============================================
  // CERRAR DROPDOWN
  // ============================================

  useEffect(() => {

    const handleClickOutside = (e) => {

      if (
        searchRef.current &&
        !searchRef.current.contains(
          e.target
        )
      ) {

        setShowResults(false);

      }

    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);

  // ============================================
  // IR A RESULTADO
  // ============================================

  const handleSelectResult = (
    item
  ) => {

    navigate(
      `${item.route}?highlight=${item.title.toLowerCase()}`
    );

    setSearch("");

    setShowResults(false);

  };

  return (

    <header className="topbar">

      {/* LEFT */}
      <div className="topbar-left">

        <button
          className="menu-btn"
          onClick={openSidebar}
        >
          <Menu size={20} />
        </button>

        {/* SEARCH */}
        <div
          className="search-wrapper"
          ref={searchRef}
        >

          <Search
            size={16}
            className="search-icon"
          />

          <input
            type="text"
            placeholder="Buscar registros..."
            className="search-input"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            onFocus={() =>
              setShowResults(true)
            }
          />

          {/* RESULTADOS */}
          {showResults &&
            search.length > 0 && (

              <div className="search-results">

                {results.length > 0 ? (

                  results.map((item) => (

                    <button
                      key={item.title}
                      className="search-result-item"
                      onClick={() =>
                        handleSelectResult(
                          item
                        )
                      }
                    >

                      <div className="search-result-icon">
                        {item.icon}
                      </div>

                      <div className="search-result-text">

                        <h4>
                          {item.title}
                        </h4>

                        <p>
                          {
                            item.description
                          }
                        </p>

                      </div>

                    </button>

                  ))

                ) : (

                  <div className="search-empty">
                    No se encontraron resultados
                  </div>

                )}

              </div>

            )}

        </div>

      </div>

      {/* RIGHT */}
      <div className="topbar-actions">

        <Bell size={18} />

        <CircleHelp size={18} />

        {children}

      </div>

    </header>

  );
}

export default Navbar;