import Sidebar from "../Sidebar/Sidebar";
import "../MobileSideBar/mobileSidebar.css";


function MobileSidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div className="mobile-overlay" onClick={onClose} />
      )}

      <div className={`mobile-sidebar ${isOpen ? "open" : ""}`}>
        <Sidebar inMobile={true} />
      </div>
    </>
  );
}

export default MobileSidebar;