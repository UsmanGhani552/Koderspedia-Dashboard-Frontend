import React from 'react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

const DeleteConfirmButton = ({
  item,
  deleteAction,
  title = 'Delete',
  className = '',
  children // this allows using <Icon> inside the button
}) => {
  const dispatch = useDispatch();

  const handleDeleteClick = () => {
    Swal.fire({
      title: `Are you sure you want to delete "${item.name}"?`,
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteAction(item.id))
          .unwrap()
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: `"${item.name}" has been deleted.`,
              timer: 1500,
              showConfirmButton: false,
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Delete Failed',
              text: error?.message || 'Something went wrong while deleting.',
            });
          });
      }
    });
  };

  return (
    <span
      title={title}
      className={className}
      onClick={handleDeleteClick}
      style={{ display: 'inline-block', cursor: 'pointer' }}
    >
      {children}
    </span>
  );
};

DeleteConfirmButton.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  deleteAction: PropTypes.func.isRequired,
  onDeleted: PropTypes.func,
  className: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default DeleteConfirmButton;
