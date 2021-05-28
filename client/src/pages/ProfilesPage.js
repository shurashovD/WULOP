//import { useHttp } from '../hooks/http.hook';
//import { AuthContext } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';

export const ProfilesPage = () => {
    /*const auth = useContext(AuthContext);
    const {request} = useHttp();
    
    const getProfiles = async () => {
        const data = await request('/api/profiles/', 'GET', null, { Authorization: `Bearer ${auth.token}` });
    }*/

    return(
        <>
            <div className="row mt-2">
                <NavLink to="/administrator/profiles/create" className="waves-effect waves-light btn-small right">Create profile</NavLink>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Profile type</th>
                        <th>Description</th>
                        <th>Profile Login</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Alvin</td>
                        <td>Eclair</td>
                        <td>$0.87</td>
                        <td>$0.87</td>
                    </tr>
                </tbody>
            </table>
            <div id="modal1" className="modal bottom-sheet">
                <div className="modal-content">
                    <h4>Modal Header</h4>
                    <p>A bunch of text</p>
                </div>
                <div className="modal-footer">
                    <a href="#!" className="modal-close waves-effect waves-green btn-flat">Agree</a>
                </div>
            </div>
        </>
    );
}