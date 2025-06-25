import { useFirebase } from './Firebase'
import { Navigate } from 'react-router-dom';

const AdminRoute = (props) => {
    const firebase = useFirebase();
    const user = firebase.user

    const cond = user.uid === "vti9nMR6dmXZHoiIfAQiwurOdiJ3"
    return !cond ? <Navigate to="/" /> : props.element
}

export default AdminRoute