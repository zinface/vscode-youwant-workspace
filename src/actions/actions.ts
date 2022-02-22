
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
//         "question": "他人修改源代码后是否可以闭源?",
//         "action": "yes|no",
//         "yes": "d",
//         "no": "b"
//     },
//     {   
//         "id": "b",
//         "questions": "新增代码是否采用同样许可证?",
//         "action": "yes|no",
//         "yes": "GPL",
//         "no": "c"
//     },
//     {   
//         "id": "c",
//         "questions": "是否需要对源码的修改，提供说明文档?",
//         "action": "yes|no",
//         "yes": "Mozilla",
//         "no": "LGPL"
//     },
//     {   
//         "id": "d",
//         "questions": "每一个修改过的文件，是否都必须放置版权说明?",
//         "action": "yes|no",
//         "yes": "Apache",
//         "no": "e"
//     },
//     {   
//         "id": "e",
//         "questions": "衍生软件的广告是否可以用你的名字促销?",
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