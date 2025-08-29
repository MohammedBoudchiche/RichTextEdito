export default function createTimeBaseID():string{
    return `${Date.now()}-${Math.random().toString().substr(2.9)}}`
}