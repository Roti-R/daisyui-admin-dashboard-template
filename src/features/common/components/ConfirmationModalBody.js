import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_CLOSE_TYPES } from '../../../utils/globalConstantUtil'
import { deleteMember, updateMember } from '../../members/memberSlice'
import { useDispatch, useSelector } from 'react-redux'

import axios from 'axios'
import { deleteLead } from '../../leads/leadSlice'
import { deleteManager } from '../../detailOrganization/managerSlice'
import { deleteOrganization } from '../../transactions/OrganizationSlice'
import { showNotification } from '../headerSlice'

function ConfirmationModalBody({ extraObject, closeModal }) {

    const dispatch = useDispatch()

    const { message, type, _id, index, updateObject } = extraObject


    const proceedWithYes = async () => {
        if (type === CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE) {
            // positive response, call api or dispatch redux function
            dispatch(deleteLead({ index }))
            dispatch(showNotification({ message: "Lead Deleted!", status: 1 }))
        }
        else if (type === CONFIRMATION_MODAL_CLOSE_TYPES.ORGANIZATION_DELETE) {

            // dispatch(deleteOrganization(index))
            try {
                // Gọi hàm xóa tổ chức ở đây (ví dụ: dispatch(deleteOrganization(orgID)))
                await dispatch(deleteOrganization(index));

                // Nếu tác vụ xóa tổ chức không ném lỗi, tức là xóa thành công
                dispatch(
                    showNotification({
                        message: 'Xóa tổ chức thành công',
                        status: 1,
                    })
                );
            } catch (error) {
                // Xử lý khi xóa tổ chức không thành công
                console.error('Lỗi khi xóa tổ chức:', error);
                dispatch(
                    showNotification({
                        message: 'Xóa tổ chức không thành công',
                        status: 0,
                    })
                );
            }
        }
        else if (type === CONFIRMATION_MODAL_CLOSE_TYPES.MEMBER_DELETE) {
            try {

                await dispatch(deleteMember(index));
                dispatch(
                    showNotification({
                        message: 'Xóa thành viên thành công',
                        status: 1,
                    })
                );
            }
            catch (err) {
                console.log(err);
                dispatch(
                    showNotification({
                        message: 'Xóa thành viên không thành công',
                        status: 0,
                    })
                );
            }
        }
        else if (type === CONFIRMATION_MODAL_CLOSE_TYPES.MEMBER_OUT_ORGANIZATION) {

            dispatch(deleteManager(index)).unwrap()
                .catch(err => {
                    dispatch(
                        showNotification({
                            message: 'Có lỗi khi xóa quyền quản lý của thành viên này',
                            status: 0,
                        })
                    );
                    return;
                })
            dispatch(updateMember({ memberID: index, member: updateObject })).unwrap()
                .then((res) => {
                    dispatch(
                        showNotification({
                            message: 'Xóa thành viên khỏi hội thành công',
                            status: 1,
                        })
                    );
                })
                .catch(err => {
                    console.log(err);
                    dispatch(
                        showNotification({
                            message: 'Xóa thành viên không thành công',
                            status: 0,
                        })
                    );
                })
        }
        else if (type === CONFIRMATION_MODAL_CLOSE_TYPES.MANAGER_DELETE) {
            dispatch(deleteManager(index)).unwrap()
                .then(() => {
                    dispatch(
                        showNotification({
                            message: 'Xóa quyền quản lý thành công',
                            status: 1,
                        })
                    );
                })
                .catch(err => {
                    console.log(err);
                    dispatch(
                        showNotification({
                            message: 'Xóa quyền quản lý không thành công',
                            status: 0,
                        })
                    );
                })
        }
        closeModal()
    }

    return (
        <>
            <p className=' text-xl mt-6 text-center'>
                {message}
            </p>

            <div className="modal-action mt-12">

                <button className="btn btn-outline   " onClick={() => closeModal()}>Không</button>

                <button className="btn btn-primary w-36" onClick={() => proceedWithYes()}>Có</button>

            </div>
        </>
    )
}

export default ConfirmationModalBody