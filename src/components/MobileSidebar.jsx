import Sidebar from "./Sidebar";

import "../styles/mobileSidebar.css";

function MobileSidebar({
  isOpen,
  onClose,
}) {

  return (

    <>

      {isOpen && (
        <div
          className="mobile-overlay"
          onClick={onClose}
        />
      )}

      <div
        className={`mobile-sidebar ${
          isOpen ? "open" : ""
        }`}
      >

        <Sidebar />

      </div>

    </>

  );
}

export default MobileSidebar;