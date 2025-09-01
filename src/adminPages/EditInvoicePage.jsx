import React from "react";
import MasterLayout from "../otherImages/MasterLayout";
import EditInvoiceForm from "../components/EditInvoiceForm";
import DefaultTopBar from "../components/DefaultTopBar";

const EditInvoicePage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        <DefaultTopBar
            title="Update Link"
            desc="Update link using a form with the following fields:"
        />

        {/* TableDataLayer */}
        <EditInvoiceForm />

      </MasterLayout>

    </>
  );
};

export default EditInvoicePage; 
