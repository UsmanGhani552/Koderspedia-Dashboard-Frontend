import React from "react";
import MasterLayout from "../otherImages/MasterLayout";
import EditBrandForm from "../components/EditBrandForm";
import DefaultTopBar from "../components/DefaultTopBar";

const EditBrandPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        <DefaultTopBar
            title="Edit  Brand"
            desc="Edit, and manage Brand account efficiently."
        />

        {/* TableDataLayer */}
        <EditBrandForm />

      </MasterLayout>

    </>
  );
};

export default EditBrandPage; 
