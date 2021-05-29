import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import { AdminPage } from './pages/AdminPage';
import { ArrowPage } from './pages/ArrowPage';
import { AuthPage } from './pages/AuthPage';
import { CreateProfilePage } from './pages/CreateProfilePage';
import { FeatheringPage } from './pages/FeatheringPage';
import { HairPage } from './pages/HairPage';
import { HyhienicPage } from './pages/HyhienicPage';
import { LipsPage } from './pages/LipsPage';
import { Microblading } from './pages/Microblading';
import { PartRegPage } from './pages/PartRegPage';
import { PhotoPage } from './pages/PhotoPage';
import { ProfilesPage } from './pages/ProfilesPage';
import { RefereePage } from './pages/RefereePage';
import { RegisterRfidPage } from './pages/RegisterRfidPage';
import { ScoreboardPage } from './pages/ScoreboardPage';

export const useRoutes = deviceType => {
    console.log('UseRoutes device', deviceType);
    let device = deviceType;
    if ( deviceType ) {
        const deviceSplit = device.split('-');
        if ( (deviceSplit[0] === 'REFEREE') && (deviceSplit[1] === 'TABLE') ) device = 'REFEREE-TABLE';
        if ( (deviceSplit[0] === 'REFEREE') && (deviceSplit[1] === 'RFID') ) device = 'REFEREE-RFID';
    }
    switch (device) {
        case 'ADMINISTRATOR' : return (
            <Switch>
                <Route path="/administrator" exact>
                    <AdminPage />
                </Route>
                <Route path="/administrator/profiles" exact>
                    <ProfilesPage />
                </Route>
                <Route path="/administrator/profiles/create" exact>
                    <CreateProfilePage />
                </Route>
                <Redirect to="/administrator" />
            </Switch>
        );
        case 'REGISTER-RFID' : return (
            <Switch>
                <Route path="/registration-rfid" exact>
                    <RegisterRfidPage />
                </Route>
                <Redirect to="/registration-rfid" />
            </Switch>
        );
        case 'REGISTER' : return (
            <Switch>
                <Route path="/registration" exact>
                    <PartRegPage />
                </Route>
                <Redirect to="/registration" />
            </Switch>
        );
        case 'PHOTO' : return (
            <Switch>
                <Route path="/photosession" exact>
                    <PhotoPage />
                </Route>
                <Redirect to="/photosession" />
            </Switch>
        );
        case 'HYHIENIC' : return (
            <Switch>
                <Route path="/hyhienical-referee" exact>
                    <HyhienicPage />
                </Route>
                <Redirect to="/hyhienical-referee" />
            </Switch>
        );
        case 'REFEREE-TABLE' : return (
            <Switch>
                <Route path="/referee" exact>
                    <RefereePage />
                </Route>
                <Route path="/lips" exact>
                    <LipsPage />
                </Route>
                <Route path="/arrow" exact>
                    <ArrowPage />
                </Route>
                <Route path="/feathering" exact>
                    <FeatheringPage />
                </Route>
                <Route path="/microblading" exact>
                    <Microblading />
                </Route>
                <Route path="/hair" exact>
                    <HairPage />
                </Route>
                <Redirect to="/referee" />
            </Switch>
        );
        case 'SCOREBOARD' : return (
            <Switch>
                <Route path="/scoreboard" exact>
                    <ScoreboardPage />
                </Route>
                <Redirect to="/scoreboard" />
            </Switch>
        );
        default : return(
            <Switch>
                <Route path="/" exact>
                    <AuthPage />
                </Route>
                <Redirect to="/" />
            </Switch>
        );
    }
}