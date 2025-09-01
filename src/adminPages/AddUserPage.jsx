import React from "react";
import MasterLayout from "../otherImages/MasterLayout";
import AddUserForm from "../components/AddUserForm";
import DefaultTopBar from "../components/DefaultTopBar";

const AddUserPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        <DefaultTopBar
            title="Add User"
            desc="Lorem ispum manage User account efficiently."
        />

        {/* TableDataLayer */}
        <AddUserForm />

      </MasterLayout>

    </>
  );
};

export default AddUserPage; 
