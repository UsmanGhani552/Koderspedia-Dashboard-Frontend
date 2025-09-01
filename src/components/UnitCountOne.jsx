import React, { useMemo } from 'react'
import { Icon } from '@iconify/react';
import downArrow from "../otherImages/ArrowDown.svg"
import thirdcard from "../otherImages/vector.svg"
import { useSelector } from 'react-redux';
const UnitCountOne = () => {
    const { invoices } = useSelector((state) => state.invoices);
    const { clients } = useSelector((state) => state.clients);
    const allTimeInvoice = invoices.length;
    const allTimeClients = clients.length;
    const monthlyData = (dataArray) => {
        const currentDate = new Date();
        return dataArray.filter(data => {
            const dataDate = new Date(data.created_at);
            return (
                dataDate.getMonth() === currentDate.getMonth() && dataDate.getFullYear() === currentDate.getFullYear()
            );
        })
    }
    const lastMonthClients = clients.filter(client => {
        const clientDate = new Date(client.created_at);
        const currentDate = new Date();
        return (
            clientDate.getMonth() === currentDate.getMonth() - 1 && clientDate.getFullYear() === currentDate.getFullYear()
        );
    })
    const monthlyInvoiceCount = monthlyData(invoices).length;
    const monthlyClientCount = monthlyData(clients).length;
    const paidInvoices = monthlyData(invoices).filter(invoice => invoice.status == 1).length;
    const unPaidInvoices = monthlyData(invoices).filter(invoice => invoice.status == 0).length;



    // Calculate repeat clients percentage
    const repeatPercentage = useMemo(() => {
        if (!invoices?.length || !clients?.length) return 0;

        // Count invoices per client
        const clientCounts = invoices.reduce((acc, invoice) => {
            acc[invoice.client_id] = (acc[invoice.client_id] || 0) + 1;
            return acc;
        }, {});

        // Filter clients with 2+ invoices
        const repeatClients = Object.values(clientCounts).filter(count => count >= 2).length;
        const totalClientsWithInvoices = Object.keys(clientCounts).length;

        return totalClientsWithInvoices > 0
            ? Math.round((repeatClients / totalClientsWithInvoices) * 100)
            : 0;
    }, [invoices, clients]);



    return (
        <>
            <h2 className='fs-2 mb-20'>Overview</h2>
            <div className="row row-cols-lg-4 row-cols-sm-2 row-cols-1 gy-4">
                <div className="col">

                    <div className="card shadow-none h-100 card-1">
                        <div className="card-body p-20">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                <div>
                                    <p className="fw-medium blackColor mb-1 ">Invoices - This Month</p>

                                </div>
                                <div className="w-40-px h-40-px bg-custom rounded-3 d-flex justify-content-center align-items-center">
                                    <Icon
                                        icon="akar-icons:clipboard"
                                        className="text-white fs-4 mb-0"
                                    />
                                </div>
                            </div>
                            <h6 className="mb-0 fs-2 blackColor">{monthlyInvoiceCount} <span className="fs-4 fw-normal blackColor">Invoices</span></h6>
                            <div className="d-flex gap-0">
                                <p className="grey pe-10 border-right fw-normal text-lg mt-12 mb-0 d-flex align-items-center gap-2">
                                    Paid: {paidInvoices}
                                </p>
                                <p className="grey ps-10 fw-normal text-lg mt-12 mb-0 d-flex align-items-center gap-2">
                                    Overdue: {unPaidInvoices}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* card end */}
                </div>
                <div className="col">
                    <div className="card shadow-none h-100 card-2">
                        <div className="card-body p-20">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                <div>
                                    <p className="fw-medium mb-1 blackColor">Invoices - All Time</p>

                                </div>
                                <div className="w-40-px h-40-px bg-custom-2 rounded-3 d-flex justify-content-center align-items-center">
                                    <Icon
                                        icon="akar-icons:clipboard"
                                        className="text-white fs-4 mb-0"
                                    />
                                </div>
                            </div>
                            <h6 className="mb-0 fs-2 blackColor">{allTimeInvoice} <span className="fs-4 fw-normal">Invoices</span></h6>
                            <div className="d-flex gap-0">
                                <p className="grey pe-10 fw-normal text-lg mt-12 mb-0 d-flex align-items-center gap-2">
                                    Top Client: {invoices[0]?.top_client?.name}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* card end */}
                </div>
                <div className="col">
                    <div className="card shadow-none h-100 card-1">
                        <div className="card-body p-20">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                <div>
                                    <p className="fw-medium blackColor mb-1">Clients - This Month</p>

                                </div>
                                <div className="w-40-px h-40-px bg-custom-3 rounded-3 d-flex justify-content-center align-items-center">
                                    <img src={thirdcard} style={{ width: '20px', height: '20px', }} />
                                </div>
                            </div>
                            <h6 className="mb-0 fs-2 blackColor">{monthlyClientCount} <span className="fs-4 fw-normal">Clients</span></h6>
                            <div className="d-flex gap-0">
                                <p className="grey pe-10 fw-normal text-lg mt-12 mb-0 d-flex align-items-center gap-2 ">
                                    <img src={downArrow} style={{ width: '25px', height: '25px', }} />+{lastMonthClients.length} from last month
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* card end */}
                </div>
                <div className="col">
                    <div className="card shadow-none h-100 card-2">
                        <div className="card-body p-20">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                <div>
                                    <p className="fw-medium blackColor mb-1">Clients - All Time</p>

                                </div>
                                <div className="w-40-px h-40-px bg-custom-3 rounded-3 d-flex justify-content-center align-items-center">
                                    <img src={thirdcard} style={{ width: '20px', height: '20px', }} />
                                </div>
                            </div>
                            <h6 className="mb-0 fs-2 blackColor">{allTimeClients} <span className="fs-4 fw-normal">Clients</span></h6>
                            <div className="d-flex gap-0">
                                <p className="grey pe-10 fw-normal text-lg mt-12 mb-0 d-flex align-items-center gap-2">
                                    <Icon icon="carbon:ibm-cloud-backup-and-recovery" width="20" height="20" />{repeatPercentage}% Repeated Clients
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* card end */}
                </div>
            </div>
        </>
    )
}

export default UnitCountOne