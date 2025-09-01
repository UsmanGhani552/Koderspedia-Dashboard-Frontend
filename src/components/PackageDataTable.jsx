import React, { useState, useMemo, useEffect } from 'react';
import MUIDataTable from 'mui-datatables';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPackages, deletePackage } from '../store/slices/packagesSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import DeleteConfirmButton from './DeleteConfirmButton';

const PackageDataTable = () => {
    const dispatch = useDispatch();
    const { packages, loading, error } = useSelector((state) => state.packages);
    const [startDate, setStartDate] = useState(new Date('2025-01-01'));
    const [endDate, setEndDate] = useState(new Date('2025-12-10'));
    const [filter] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(fetchPackages());
    }, [dispatch]);

    const handleEditPackage = (rowData) => {
        navigate(`/edit-package/${rowData.id}`, { state: { package: rowData } });
    };

    const CustomInput = ({ value, onClick }) => (
        <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={onClick}>
            <Icon icon="uil:calender" width="18" />
            <span>{value}</span>
        </button>
    );

    // Transform packages data for the table
    const transformedPackages = useMemo(() => {

        if (!packages) return [];
        return packages.map(pkg => ({
            ...pkg, // include everything from the backend
            date: pkg.created_at ? new Date(pkg.created_at).toLocaleDateString() : 'N/A',
            category: pkg.category?.name || 'N/A', // for display
        }));
    }, [packages]);
    const filteredData = useMemo(() => {
        return transformedPackages.filter(pkg => {
            const rowDate = new Date(pkg.created_at);
            const isInDateRange = rowDate >= new Date(startDate.setHours(0, 0, 0, 0)) &&
                rowDate <= new Date(endDate.setHours(23, 59, 59, 999));
            const isInTypeFilter = !filter || pkg.type === filter;
            return isInDateRange && isInTypeFilter;
        });
    }, [transformedPackages, startDate, endDate, filter]);
    // const filteredData = transformedPackages;

    const htmlToText = (html = "") => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
    };

    const columns = [
        {
            name: 'name',
            label: 'Package Name',
            options: {
                customBodyRender: (value, tableMeta) => {
                    const rowData = filteredData[tableMeta.rowIndex];
                    return (
                        <div className="d-flex align-items-center gap-3">
                            <span>{value}</span>
                        </div>
                    );
                }
            }
        },
        {
            name: 'date',
            label: 'Date',
            options: {
                customBodyRender: (value) => (
                    <span className="text-muted">{value}</span>
                )
            }
        },
        {
            name: "description",
            label: "Description",
            options: {
                customBodyRender: (value) => {
                    const text = htmlToText(value);
                    return (
                        <div
                            className="text-truncate d-inline-block"
                            style={{
                                maxWidth: 200,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                            title={text} // hover to see full text
                        >
                            {text}
                        </div>
                    );
                },
            },
        },

        {
            name: 'price',
            label: 'Price',
            options: {
                customBodyRender: (value) => (
                    <span className="fw-bold">${parseFloat(value).toFixed(0)}</span>
                )
            }
        },
        {
            name: 'category',
            label: 'Category',
            options: {
                customBodyRender: (value) => {
                    const colorClass = {
                        'Website': 'bg-primary',
                        'Mobile App': 'bg-info',
                        'Seo': 'bg-warning',
                        'Social Media': 'bg-success',
                    }[value] || 'bg-primary';

                    return (
                        <span className={`badge ${colorClass} text-white`}>
                            {value}
                        </span>
                    );
                }
            }
        },
        {
            name: 'actions',
            label: 'Actions',
            options: {
                filter: false,
                sort: false,
                customBodyRenderLite: (dataIndex) => {
                    const rowData = filteredData[dataIndex];
                    return (
                        <div>
                            <Icon
                                onClick={() => handleEditPackage(rowData)}
                                className="editBtn hover: cursor-pointer"
                                icon="line-md:edit"
                                width="24"
                                height="24"
                            />
                            <DeleteConfirmButton
                                item={{ id: rowData.id, name: rowData.name }}
                                deleteAction={deletePackage}
                                onDeleted={() => console.log('Deleted')}
                                className="deleteBtn hover:cursor-pointer"
                                title="Delete Package"
                            >
                                <Icon icon="material-symbols:delete-outline" width="24" height="24" />
                            </DeleteConfirmButton>
                        </div>
                    );
                }
            }
        }
    ];

    const options = {
        selectableRows: 'none',
        rowsPerPage: 10,
        responsive: 'standard',
        elevation: 0,
        print: false,
        download: false,
        viewColumns: false,
        filter: true,
        search: true,
        serverSide: false,
        textLabels: {
            body: {
                noMatch: loading ? <LoadingSpinner /> : error || 'No packages found',
            }
        }
    };

    return (
        <div className="card basic-data-table">
            <div className="card-header d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                    <DatePicker
                        selected={startDate}
                        onChange={date => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        customInput={<CustomInput />}
                        dateFormat="dd MMM yyyy"
                    />
                    <span>-</span>
                    <DatePicker
                        selected={endDate}
                        onChange={date => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        customInput={<CustomInput />}
                        dateFormat="dd MMM yyyy"
                    />
                </div>
                {/* <div className="filter-select">
                    <select
                        className="form-select"
                        value={filter}
                        id="packageTypeFilter"
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="">All Type</option>
                        <option value="WEBSITE">Website</option>
                        <option value="App">App</option>
                        <option value="SEO">SEO</option>
                        <option value="SOCIAL MEDIA">Social Media</option>
                    </select>
                </div> */}
            </div>
            <div className="card-body">
                <MUIDataTable
                    data={filteredData}
                    columns={columns}
                    options={options}
                    className="overflow-hidden packageTable"
                />
            </div>
        </div>
    );
};

export default PackageDataTable;
