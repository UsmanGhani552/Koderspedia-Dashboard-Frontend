import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import ThemeToggleButton from "../helper/ThemeToggleButton";
import webLogo from "../otherImages/logo-icon.png"
import webSideLogo from "../otherImages/logo.svg"
import LogoutNavLink from "../components/LogoutNavLink";
import { useSelector } from 'react-redux';
import { fetchUser } from "../store/slices/authSlice";
import { useDispatch } from "react-redux";

const MasterLayout = ({ children }) => {
  const role = useSelector((state) => state.auth.role);
  const { user } = useSelector((state) => state.auth);
  const [sidebarActive, setSidebarActive] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);
  const handleEditUser = (user) => {
    navigate(`/edit-user/${user.id}`, { state: { user: user } });
  };
  useEffect(() => {
    const openActiveDropdown = () => {
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        const submenuLinks = dropdown.querySelectorAll(".sidebar-submenu li a");
        submenuLinks.forEach((link) => {
          if (
            link.getAttribute("href") === location.pathname ||
            link.getAttribute("to") === location.pathname
          ) {
            dropdown.classList.add("open");
            const submenu = dropdown.querySelector(".sidebar-submenu");
            if (submenu) {
              submenu.style.maxHeight = `${submenu.scrollHeight}px`;
            }
          }
        });
      });
    };

    openActiveDropdown();
  }, [location.pathname]);

  const sidebarControl = () => setSidebarActive(!sidebarActive);
  const mobileMenuControl = () => setMobileMenu(!mobileMenu);

  return (
    <section className={mobileMenu ? "overlay active" : "overlay "}>
      {/* sidebar */}
      <aside
        className={
          sidebarActive
            ? "sidebar active "
            : mobileMenu
              ? "sidebar sidebar-open"
              : "sidebar"
        }
      >
        <button
          onClick={mobileMenuControl}
          type='button'
          className='sidebar-close-btn'
        >
          <Icon icon='radix-icons:cross-2' />
        </button>
        <div>
          <Link to='/' className='sidebar-logo'>
            <img
              src={webLogo}
              alt='site logo'
              className='light-logo'
            />
            <img
              src={webLogo}
              alt='site logo'
              className='dark-logo'
            />
            <img
              src={webSideLogo}
              alt='site logo'
              className='logo-icon'
              style={{ width: "40px", }}
            />
          </Link>
        </div>
        <div className='sidebar-menu-area'>
          <ul className='sidebar-menu' id='sidebar-menu'>
            {(role === "super admin" || role === "admin") && (
              <>
                <li>
                  <NavLink to='/dashboard'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <Icon
                      icon='hugeicons:dashboard-square-01'
                      className='menu-icon'
                      width="23"
                    />
                    <span>Dashboard</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/manage-clients'
                    className={(navData) => (navData.isActive ? "active-page" : "")}
                  >
                    <Icon icon='mdi:account-group' className='menu-icon' width="25" height="25" />
                    <span>Manage Clients</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/manage-packages'
                    className={(navData) => (navData.isActive ? "active-page" : "")}
                  >
                    <Icon icon='carbon:trophy' className='menu-icon' width="28" height="28" />
                    <span>Packages</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/manage-invoice'
                    className={(navData) => (navData.isActive ? "active-page" : "")}
                  >
                    <Icon icon='akar-icons:clipboard' className='menu-icon' width="28" height="28" />
                    <span>Invoices</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/manage-brands'
                    className={(navData) => (navData.isActive ? "active-page" : "")}
                  >
                    <Icon icon='fa7-brands:artstation' className='menu-icon' width="28" height="28" />
                    <span>Brands</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/login-history'
                    className={(navData) => (navData.isActive ? "active-page" : "")}
                  >
                    <Icon icon='teenyicons:briefcase-alt-outline' className='menu-icon' width="23" height="23" style={{ marginRight: "10px", }} />
                    <span>Login Activity</span>
                  </NavLink>
                </li>
              </>
            )}
            {role === "super admin" && (
              <li>
                <NavLink
                  to='/manage-users'
                  className={(navData) => (navData.isActive ? "active-page" : "")}
                >
                  <Icon icon='uil:user-md' className='menu-icon' width="28" height="28" />
                  <span>Users</span>
                </NavLink>
              </li>
            )}


            {role === "client" && (
              <>
                <li>
                  <NavLink to='/all-packages' className={(navData) => navData.isActive ? "active-page" : ""}>
                    <Icon icon='carbon:categories' className='menu-icon' width="24" height="24" />
                    <span>All Packages</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to='/my-packages' className={(navData) => navData.isActive ? "active-page" : ""}>
                    <Icon icon='mdi:package-variant' className='menu-icon' width="24" height="24" />
                    <span>My Packages</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to='/payment-history' className={(navData) => navData.isActive ? "active-page" : ""}>
                    <Icon icon='fluent:payment-20-regular' className='menu-icon' width="24" height="24" />
                    <span>Payment History</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to='/edit-profile' className={(navData) => navData.isActive ? "active-page" : ""}>
                    <Icon icon="material-symbols:settings-outline-rounded" width="24" height="24" />
                    <span>Settings</span>
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
        <div className="bottomSide">
          <ul>
            <li>
              <a href="mailto:connect@koderspedia.com">
                <Icon icon='tabler:building-estate' className='menu-icon' width="28" height="28" />
                <span>Help Center</span>
              </a>
            </li>
            <li>
              {/* <NavLink to='/'>
                <Icon icon='material-symbols:logout-rounded' className='menu-icon' width="28" height="28" />
                <span>Log Out</span>
              </NavLink> */}
              <LogoutNavLink />
            </li>
          </ul>
        </div>
      </aside>

      <main
        className={sidebarActive ? "dashboard-main active" : "dashboard-main"}
      >
        <div className='navbar-header'>
          <div className='row align-items-center justify-content-between'>
            <div className='col-auto'>
              <div className='d-flex flex-wrap align-items-center gap-4'>
                <button
                  type='button'
                  className='sidebar-toggle'
                  onClick={sidebarControl}
                >
                  {sidebarActive ? (
                    <Icon
                      icon='iconoir:arrow-right'
                      className='icon text-2xl non-active'
                    />
                  ) : (
                    <Icon
                      icon='heroicons:bars-3-solid'
                      className='icon text-2xl non-active '
                    />
                  )}
                </button>
                <button
                  onClick={mobileMenuControl}
                  type='button'
                  className='sidebar-mobile-toggle'
                >
                  <Icon icon='heroicons:bars-3-solid' className='icon' />
                </button>
                <form className='navbar-search'>
                  <input type='text' name='search' placeholder='Search' />
                  <Icon icon='ion:search-outline' className='icon' />
                </form>
              </div>
            </div>
            <div className='col-auto'>
              <div className='d-flex flex-wrap align-items-center gap-3'>
                {/* ThemeToggleButton */}
                <ThemeToggleButton />

                {/* Notification dropdown end */}
                <div className='dropdown'>
                  <button
                    className='d-flex justify-content-center align-items-center rounded-circle'
                    type='button'
                    data-bs-toggle='dropdown'
                  >
                    <img
                      src={user.image_url}
                      alt='image_user'
                      className='w-40-px h-40-px object-fit-cover rounded-circle'
                    />
                  </button>
                  <div className='dropdown-menu to-top dropdown-menu-sm'>
                    <div className='py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
                      <div>
                        <h6 className='text-lg text-primary-light fw-semibold mb-2'>
                          {user.name}
                        </h6>
                        <span className='text-secondary-light fw-medium text-sm'>
                          {user.role}
                        </span>
                      </div>
                      <button type='button' className='hover-text-danger'>
                        <Icon
                          icon='radix-icons:cross-1'
                          className='icon text-xl'
                        />
                      </button>
                    </div>
                    <ul className='to-top-list'>
                      {user.role !== 'client' && (
                        <li>
                          <button
                            className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                            onClick={() => handleEditUser(user)}
                          >
                            <Icon
                              icon='solar:user-linear'
                              className='icon text-xl'
                            />{" "}
                            Edit Profile
                          </button>
                        </li>
                      )}
                      {/* <li>
                        <Link
                          className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                          to='/email'
                        >
                          <Icon
                            icon='tabler:message-check'
                            className='icon text-xl'
                          />{" "}
                          Inbox
                        </Link>
                      </li> */}
                      {/* <li>
                        <Link
                          className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                          to='/company'
                        >
                          <Icon
                            icon='icon-park-outline:setting-two'
                            className='icon text-xl'
                          />
                          Setting
                        </Link>
                      </li> */}
                      {/* <li>
                        <Link
                          className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-danger d-flex align-items-center gap-3'
                          to='/'
                        >
                          <Icon icon='lucide:power' className='icon text-xl' />{" "}
                          Log Out
                        </Link>
                      </li> */}
                    </ul>
                  </div>
                </div>
                {/* Profile dropdown end */}
              </div>
            </div>
          </div>
        </div>

        {/* dashboard-main-body */}
        <div className='dashboard-main-body'>{children}</div>

      </main>
    </section>
  );
};

export default MasterLayout;
