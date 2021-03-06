
interface IYes {
    yes: string;
}
interface INo {
    no: string;
}

interface IQuestion extends IYes ,INo {
    id: string;
    question: string;
    action: string;
}

interface IActionShell {
    commands: string[];
}

interface IActionGit {
    url: string;
}

interface IAction {
    action: string;
    shell: IActionShell;
    git: IActionGit;
}

interface IAnswer extends IAction{
    answer: string;
}

function findNextQuestion(id: string, questions: IQuestion[]): IQuestion|undefined {
    for (let i = 0; i < questions.length; i++) {
        if (questions[i].id === id) {
            return questions[i];
        }
    }
    return undefined;
}

function RunAction(action: IAction) {

}

export function RunQuestionQAndA(questions: IQuestion[], aswers: IAnswer[]) {
    
}

// const answers: IAnswer[] = [
//     {
//         "answer": "LGPL",
//         "action": "shell",
//         "shell": {
//             "commands": [
//                 "curl "
//             ]
//         },
//         git:undefined
//     },
//     {
//         "answer": "Mozilla",
//         "action": "shell",
//         "shell": {
//             "commands": [
//                 "curl "
//             ]
//         },
//         git:undefined
//     },
//     {
//         "answer": "GPL",
//         "action": "shell",
//         "shell": {
//             "commands": [
//                 "curl "
//             ]
//         },
//         git:undefined
//     },
//     {
//         "answer": "BSD",
//         "action": "shell",
//         "shell": {
//             "commands": [
//                 "curl "
//             ]
//         },
//         git:undefined
//     },
//     {
//         "answer": "MIT",
//         "action": "shell",
//         "shell": {
//             "commands": [
//                 "curl "
//             ]
//         },
//         git:undefined
//     },
//     {
//         "answer": "Apache",
//         "action": "shell",
//         "shell": {
//             "commands": [
//                 "curl "
//             ]
//         },
//         git:undefined
//     }
// ]

// const jstr = 
// [
//     {   
//         "id": "a",
//         "question": "???????????????????????????????????????????",
//         "action": "yes|no",
//         "yes": "d",
//         "no": "b"
//     },
//     {   
//         "id": "b",
//         "questions": "????????????????????????????????????????",
//         "action": "yes|no",
//         "yes": "GPL",
//         "no": "c"
//     },
//     {   
//         "id": "c",
//         "questions": "????????????????????????????????????????????????????",
//         "action": "yes|no",
//         "yes": "Mozilla",
//         "no": "LGPL"
//     },
//     {   
//         "id": "d",
//         "questions": "????????????????????????????????????????????????????????????????",
//         "action": "yes|no",
//         "yes": "Apache",
//         "no": "e"
//     },
//     {   
//         "id": "e",
//         "questions": "???????????????????????????????????????????????????????",
//         "action": "yes|no",
//         "yes": "BSD",
//         "no": "MIT"
//     }
// ]

// function todo(data: any) {
//     let questions:IQuestion[] = data
//     console.log(questions.length)
//     questions.forEach(question => {
//         let keys = question.action.split("|")
//         for (let i = 0; i < keys.length; i++) {
//             if (keys[i] == "yes") {
//                 console.log(question.yes)
//             }
//         }
//     });
// }

// todo(jstr)