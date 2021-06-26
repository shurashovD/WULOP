import { useContext } from "react";
import { DictionaryContext } from "../dictionary/dictionaryContext";
import { TasksContext } from "./TasksContext";

export const TasksState = ({children}) => {

    const dictionary = useContext(DictionaryContext);
    const {dg} = dictionary;

    const Hair = {
    name: dg('hairTechnology'),
    list: [
            {
                id: 1,
                test: dg('harmonyOfImage'),
                dect: dg('harmonyOfImageD'),
            },
            {
                id: 2,
                test: dg('form'),
                dect: dg('formD'),
            },
            {
                id: 3,
                test: dg('naturalnessOfHairStyling'),
                dect: dg('naturalnessOfHairStylingD'),
            },
            {
                id: 4,
                test: dg('clarityAndEleganceOfHair'),
                dect: dg('clarityAndEleganceOfHairD'),
            },
            {
                id: 5,
                test: dg('correctDistanceOfHairsFromEachOther'),
                dect: dg('correctDistanceOfHairsFromEachOtherD'),
            },
            {
                id: 6,
                test: dg('colour'),
                dect: dg('colourD'),
            },
            {
                id: 7,
                test: dg('symmetry'),
                dect: dg('symmetryD'),
            },
            {
                id: 8,
                test: dg('traumatization'),
                dect: dg('traumatizationD'),
            },
            {
                id: 9,
                test: dg('complexityOfWork'),
                dect: dg('complexityOfWorkD'),
            },
            {
                id: 10,
                test: dg('hairStyling'),
                dect: dg('hairStylingD'),
            }
        ]
    }

    const Microblading = {
        name: dg('Microblading'),
        list: [
            {
                id: 11,
                test: dg('harmonyOfImage'),
                dect: dg('harmonyOfImageD'),
            },
            {
                id: 12,
                test: dg('form'),
                dect: dg('formD'),
            },
            {
                id: 13,
                test: dg('naturalnessOfHairStyling'),
                dect: dg('naturalnessOfHairStylingD'),
            },
            {
                id: 14,
                test: dg('clarityAndEleganceOfHair'),
                dect: dg('clarityAndEleganceOfHairD'),
            },
            {
                id: 15,
                test: dg('correctDistanceOfHairsFromEachOther'),
                dect: dg('correctDistanceOfHairsFromEachOtherD'),
            },
            {
                id: 16,
                test: dg('colour'),
                dect: dg('colourD'),
            },
            {
                id: 17,
                test: dg('symmetry'),
                dect: dg('symmetryD'),
            },
            {
                id: 18,
                test: dg('traumatization'),
                dect: dg('traumatizationD'),
            },
            {
                id: 19,
                test: dg('complexityOfWork'),
                dect: dg('complexityOfWorkD'),
            },
            {
                id: 20,
                test: dg('hairStyling'),
                dect: dg('hairStylingD'),
            }
        ]
    }

    const Lips = {
        name: dg('lips'),
        list: [
            {
                id: 21,
                test: dg('harmonyOfImage'),
                dect: dg('harmonyOfImageArrowD'),
            },
            {
                id: 22,
                test: dg('form'),
                dect: dg('formLipsD')
            },
            {
                id: 23,
                test: dg('colour'),
                dect: dg('colourLipsD'),
            },
            {
                id: 24,
                test: dg('symmetry'),
                dect: dg('symmetryArrowD'),
            },
            {
                id: 25,
                test: dg('outline'),
                dect: dg('outlineD')
            },
            {
                id: 26,
                test: dg('prokras'),
                dect: dg('prokrasD'),
            },
            {
                id: 27,
                test: dg('traumatization'),
                dect: dg('traumatizationLipsD')
            },
            {
                id: 28,
                test: dg('complexityOfWork'),
                dect: dg('complexityOfWorkLipsD'),
            },
            {
                id: 29,
                test: dg('evennessOfProcrastination'),
                dect: dg('evennessOfProcrastinationD')
            }
        ]
    }

    const Arrow = {
        name: dg('arrow'),
        list: [
            {
                id: 31,
                test: dg('harmonyOfImage'),
                dect: dg('harmonyOfImageArrowD')
            },
            {
                id: 32,
                test: dg('form'),
                dect: dg('formArrowD')
            },
            {
                id: 33,
                test: dg('symmetry'),
                dect: dg('symmetryArrowD'),
            },
            {
                id: 34,
                test: dg('elegance'),
                dect: dg('eleganceD')
            },
            {
                id: 35,
                test: dg('Gradient'),
                dect: dg('GradientArrowD'),
            },
            {
                id: 36,
                test: dg('paintingInterstitialSpace'),
                dect: 'Оценивается равномерное плотное окрашивание всей межресничной зоны.',
            },
            {
                id: 37,
                test: dg('colour'),
                dect: dg('colourArrowD')
            },
            {
                id: 38,
                test: dg('traumatization'),
                dect: dg('traumatizationArrowD')
            },
        ]
    }

    const Feathering = {
        name: dg('feathering'),
        list: [
            {
                id: 41,
                test: dg('harmonyOfImage'),
                dect: dg('harmonyOfImageD'),
            },
            {
                id: 42,
                test: dg('form'),
                dect: dg('formFeatD'),
            },
            {
                id: 43,
                test: dg('colour'),
                dect: dg('colourD'),
            },
            {
                id: 44,
                test: dg('symmetry'),
                dect: dg('symmetryFeatD')
            },
            {
                id: 45,
                test: dg('traumatization'),
                dect: dg('traumatizationD'),
            },
            {
                id: 46,
                test: dg('designOfEyebrowHead'),
                dect: dg('designOfEyebrowHeadD'),
            },
            {
                id: 47,
                test: dg('Gradient'),
                dect: dg('GradientD'),
            }
        ]
    }

    const tasks = [
        Hair, Microblading, Lips, Feathering, Arrow
    ]

    return (
        <TasksContext.Provider value={{ tasks }}>
            {children}
        </TasksContext.Provider>
    );
}