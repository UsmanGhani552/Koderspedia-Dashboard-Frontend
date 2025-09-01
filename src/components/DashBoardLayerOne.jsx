import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import SalesStatisticOne from "../components/SalesStatisticOne";
import CustomerStatistics from "../components/CustomerStatistics";
import UsersOverviewOne from "../components/UsersOverviewOne";
import ClientInvoiceList from "../components/ClientInvoiceList";
import UnitCountOne from "../components/UnitCountOne";
import UsersOverviewTwo from "../components/UsersOverviewTwo";
import { useDispatch } from "react-redux";
import { fetchClients } from "../store/slices/clientSlice";
import { fetchInvoices } from "../store/slices/invoiceSlice";
import CustomersList from "./CustomersList";

const DashBoardLayerOne = () => {

    const dispatch = useDispatch();
    const [filter, setFilter] = useState("monthly"); // 'monthly' | 'all'
    const [activeTab, setActiveTab] = useState("invoices"); // 'customers' | 'invoices'

    useEffect(() => {
        dispatch(fetchClients());
    }, [dispatch]);
    useEffect(() => {
        dispatch(fetchInvoices());
    }, [dispatch]);

    return (
        <>
            {/* UnitCountOne */}
            <UnitCountOne />

            {/* --- Custom Toggle --- */}
            <div
                className="custom-toggle mt-5 d-flex justify-content-between"
                role="tablist"
                aria-label="Dashboard view selector"
            >
                <div className="toggle-container">
                    <div
                        className={`toggle-indicator ${activeTab === "invoices" ? "right" : "left"}`}
                        aria-hidden="true"
                    />
                    <button
                        type="button"
                        className={`toggle-option ${activeTab === "customers" ? "active" : ""}`}
                        onClick={() => setActiveTab("customers")}
                        role="tab"
                        aria-selected={activeTab === "customers"}
                        aria-controls="customers-panel"
                        id="customers-tab"
                    >
                        <Icon icon="mdi:account-group" width="22" />
                        <span>Customers</span>
                    </button>

                    <button
                        type="button"
                        className={`toggle-option ${activeTab === "invoices" ? "active" : ""}`}
                        onClick={() => setActiveTab("invoices")}
                        role="tab"
                        aria-selected={activeTab === "invoices"}
                        aria-controls="invoices-panel"
                        id="invoices-tab"
                    >
                        <Icon icon="akar-icons:clipboard" width="25" />
                        <span>Invoices</span>
                    </button>
                </div>
                {activeTab == 'invoices' && (
                    <div className="custom-toggle">
                        <div className="toggle-container">
                            <div
                                className={`toggle-indicator ${filter === "all" ? "right" : "left"}`}
                            />
                            <div
                                className={`toggle-option ${filter === "monthly" ? "active" : ""}`}
                                onClick={() => setFilter("monthly")}
                            >
                                <Icon icon="mdi:account" width="22" />
                                <span>This Month</span>
                            </div>
                            <div
                                className={`toggle-option ${filter === "all" ? "active" : ""}`}
                                onClick={() => setFilter("all")}
                            >
                                <Icon icon="mdi:account-group" width="25" />
                                <span>All Time</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* --- Panels --- */}
            <div className="tab-content">
                <div
                    id="customers-panel"
                    role="tabpanel"
                    aria-labelledby="customers-tab"
                    className={`tab-pane ${activeTab === "customers" ? "show active" : "d-none"}`}
                >
                    <section className="row gy-4 mt-1">
                        <CustomerStatistics />
                        <CustomersList />
                    </section>
                </div>

                <div
                    id="invoices-panel"
                    role="tabpanel"
                    aria-labelledby="invoices-tab"
                    className={`tab-pane ${activeTab === "invoices" ? "show active" : "d-none"}`}
                >
                    <section className="row gy-4 mt-1">
                        <SalesStatisticOne />
                        <UsersOverviewOne filter={filter}/>
                        <UsersOverviewTwo filter={filter}/>
                        <ClientInvoiceList />
                    </section>
                </div>
            </div>
        </>
    );
};

export default DashBoardLayerOne;
