import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { HyhienicPage } from './pages/HyhienicPage';
import { PartRegPage } from './pages/PartRegPage';
import { PhotoPage } from './pages/PhotoPage';
import { PrevPage } from './pages/PrevPage';
import { RefereePage } from './pages/RefereePage';
import { RegListPage } from './pages/RegListPage';
import { ScoreboardPage } from './pages/ScoreboardPage';
import { Yakushkina } from './pages/Yakushkina';

export const useRoutes = deviceType => {
    let device = deviceType;
    if ( deviceType ) {
        const deviceSplit = device.split('-');
        if ( deviceSplit[0] === 'REFEREE') device = 'REFEREE';
    }
    switch (device) {
        case 'ADMINISTRATOR' : return (
            <Switch>
                <Route path="/yakushkina" exact>
                    <Yakushkina />
                </Route>
                <Redirect to="/yakushkina" />
            </Switch>
        );
        case 'REGISTER' : return (
            <Switch>
                <Route path="/registration" exact>
                    <PartRegPage />
                </Route>
                <Route path="/registration/list" exact>
                    <RegListPage />
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
        case 'PREVIOUS-REFEREE-TABLE' : return (
            <Switch>
                <Route path="/prev" exact>
                    <PrevPage />
                </Route>
                <Redirect to="/prev" />
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
        case 'REFEREE' : return (
            <Switch>
                <Route path="/referee" exact>
                    <RefereePage />
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
                <Route path="/yakushkina" exact>
                    <Yakushkina />
                </Route>
                <Redirect to="/" />
            </Switch>
        );
    }
}