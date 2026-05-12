import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import SalesStatisticOne from "../components/SalesStatisticOne";
import CustomerStatistics from "../components/CustomerStatistics";
import UsersOverviewOne from "../components/UsersOverviewOne";
import ClientInvoiceList from "../components/ClientInvoiceList";
import UnitCountOne from "../components/UnitCountOne";
import UsersOverviewTwo from "../components/UsersOverviewTwo";
import { useDispatch, useSelector } from "react-redux";
import { fetchClients } from "../store/slices/clientSlice";
import { fetchInvoices } from "../store/slices/invoiceSlice";
import CustomersList from "./CustomersList";

const DashBoardLayerOne = () => {
    const dispatch = useDispatch();
    const { invoices } = useSelector((state) => state.invoices);
    const { clients } = useSelector((state) => state.clients); // Get clients too

    const [filter, setFilter] = useState("yearly"); // 'monthly' | 'all'
    const [activeTab, setActiveTab] = useState("invoices"); // 'customers' | 'invoices'
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [availableYears, setAvailableYears] = useState([]);

    // Extract unique years from BOTH invoices and clients
    useEffect(() => {
        const allYears = new Set();

        // Add years from invoices
        if (invoices && invoices.length > 0) {
            invoices.forEach(invoice => {
                const invoiceDate = new Date(invoice.created_at);
                allYears.add(invoiceDate.getFullYear());
            });
        }

        // Add years from clients (assuming clients have a created_at field)
        if (clients && clients.length > 0) {
            clients.forEach(client => {
                if (client.created_at) {
                    const clientDate = new Date(client.created_at);
                    allYears.add(clientDate.getFullYear());
                }
            });
        }

        const yearsArray = Array.from(allYears).sort((a, b) => b - a);
        setAvailableYears(yearsArray);

        if (yearsArray.length > 0 && !yearsArray.includes(selectedYear)) {
            setSelectedYear(yearsArray[0]);
        }
    }, [invoices, clients, selectedYear]);

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

                {/* Year Filter and Selector - Show for BOTH tabs */}
                {/* Year Filter and Selector - Show for BOTH tabs */}
                <div className="d-flex align-items-center gap-3">
                    <div className="custom-toggle">
                        <div className="toggle-container">
                            <div className={`toggle-indicator-monthly ${filter === "all" ? "right" : filter === "monthly" ? "left" : "center"}`} />
                            <div className={`toggle-option ${filter === "monthly" ? "active" : ""}`} onClick={() => setFilter("monthly")} >
                                <Icon icon="mdi:calendar-month" width="22" />
                                <span>Monthly View</span>
                            </div>
                            <div className={`toggle-option ${filter === "yearly" ? "active" : ""}`} onClick={() => setFilter("yearly")} >
                                <Icon icon="mdi:calendar-month" width="22" />
                                <span>Yearly View</span>
                            </div>
                            <div className={`toggle-option ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")} >
                                <Icon icon="mdi:calendar-multiple" width="25" />
                                <span>All Time</span>
                            </div>
                        </div>
                    </div>

                    {/* Year Selector Dropdown - Show ONLY for Yearly View */}
                    {filter === 'yearly' && availableYears.length > 0 && (
                        <div className="year-selector">
                            <div className="input-group input-group-sm" style={{ width: '140px' }}>
                                <span className="input-group-text bg-light border-end-0">
                                    <Icon icon="mdi:calendar" width="16" />
                                </span>
                                <select
                                    className="form-select border-start-0"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                    style={{ paddingLeft: '8px' }}
                                >
                                    {availableYears.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>
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
                        <CustomerStatistics filter={filter} selectedYear={selectedYear} />
                        <CustomersList filter={filter} selectedYear={selectedYear} />
                    </section>
                </div>

                <div
                    id="invoices-panel"
                    role="tabpanel"
                    aria-labelledby="invoices-tab"
                    className={`tab-pane ${activeTab === "invoices" ? "show active" : "d-none"}`}
                >
                    <section className="row gy-4 mt-1">
                        <SalesStatisticOne filter={filter} selectedYear={selectedYear} />
                        <UsersOverviewOne filter={filter} selectedYear={selectedYear} />
                        <UsersOverviewTwo filter={filter} selectedYear={selectedYear} />
                        <ClientInvoiceList filter={filter} selectedYear={selectedYear} />
                    </section>
                </div>
            </div>
        </>
    );
};

export default DashBoardLayerOne;