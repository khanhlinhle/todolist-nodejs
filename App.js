const fs = require("fs");
const yargs = require("yargs");
const chalk = require("chalk");

function loadData() {
    try {
        const buffer = fs.readFileSync("data.json"); //read file to buffer/binary data
        const data = buffer.toString(); //stringify it
        const dataObj = JSON.parse(data); //convert json into js object
        return dataObj;
    } catch (err) {
        return [];
    }
}

function saveData(data) {
    fs.writeFileSync("data.json", JSON.stringify(data));
}

function addTodo(todo, status) {
    const data = loadData();

    const newTodo = { 
        id: data.length === 0 ? 1 : data[data.length - 1].id + 1,
        todo: todo, 
        status: status };
    data.push(newTodo);
    saveData(data);
}

yargs.command({
    command: "list",
    describe: "Listing all todos",
    alias: "l",
    builder: {
        status: {
            describe: "Status of your todo",
            demandOption: false,
            type: "boolean",
            alias: "s",
        }
    },
    handler: function ({ status }) {
        console.log(chalk.green.bold("Listing todos"));
        let data = loadData();
        if (status === true) {
            data = data.filter(item => {
                if (item.status === true) {
                    console.log(item);
                    return true;
                } else return false;
            });
        } else if (status === false) {
            data = data.filter(item => {
                if (item.status === false) {
                    console.log(item);
                    return true;
                } else return false;
            });
        } else {
            data = data;
        }
        data.forEach(({ todo, status }, idx) => console.log(`
            idx: ${idx} 
            todo: ${todo} 
            status: ${status}`
        ));
    }
})

yargs.command({
    command: "add",
    describe: "Add a new todo",
    builder: {
        todo: {
            describe: "todo content",
            demandOption: true,
            type: "string",
            alias: "t"
        },
        status: {
            describe: "Status of your todo",
            demandOption: false,
            type: "boolean",
            alias: "s",
            default: false
        }
    },
    handler: function ({ todo, status }) {
        addTodo(todo, status);
    }
})

yargs.command({
    command: "delete",
    describe: "Delete todo by id",
    builder: {
        idNumber: {
            describe: "Number",
            demandOption: false,
            type: "number",
            alias: "no",
        }
    },
    handler: function ({ idNumber }) {
        let data = loadData();
        let newData = data.filter(item => {
            if (item.id !== idNumber) {
                console.log(item);
                return true;
            } else return false;
        } );
        saveData(newData);
    }
})

yargs.command({
    command: "delete-completed",
    describe: "Delete todo by status",
    builder: {
        status: {
            describe: "Status of your todo",
            demandOption: false,
            type: "boolean",
            alias: "s",
            default: true
        }
    },
    handler: function ({ status }) {
        let data = loadData();
        let newData = data.filter(item => {
            if (item.status !== true) {
                console.log(item);
                return true;
            } else return false;
        } );
        saveData(newData);
    }
})

yargs.command({
    command: "delete-all",
    describe: "Delete Everything",
    handler: function () {
        let newData = [];
        saveData(newData);
    }
})

yargs.parse()