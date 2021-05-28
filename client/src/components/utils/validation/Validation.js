export const isEmpty = value => {
    if(!value) return true
    return false
}

export const isEmail = email => {
    // eslint-disable-next-line
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export const isLength = password => {
    if(password.length < 6) return true
    return false
}

export const isMatch = (password, cf_password) => {
    if(password === cf_password) return true
    return false
}

export const validatePassword = (pass) => {
    const re = /^(?=(.*\d){1})(?=(.*[A-Z]){1})(?=(.*[a-z]){1})(?=(.*[!@#$%]){1})[0-9a-zA-Z!@#$%]{6,12}$/;
    return re.test(pass);
}

export const validateName = (name) => {
    const re = /^[a-zA-Z0-9]{3,12}$/;
    return re.test(name);
}

export const validateTitle = (title) => {
    const re= /^[a-z A-Z]{3,30}$/;
    return re.test(title)
}

export const validateInstitute = (institute_name) => {
    const re= /^[a-z A-Z]{6,30}$/;
    return re.test(institute_name)
}

export const validateCompanyName = (company_name) => {
    const re= /^[a-z A-Z]{6,30}$/;
    return re.test(company_name)
}
export const validateCeoName = (ceo_name) => {
    const re= /^[a-z A-Z]{6,30}$/;
    return re.test(ceo_name)
}

export const validateSalary = (salary) =>{
    const re= /^[0-9]{3,30}$/;
    return re.test(salary)
}

export const validatePin = (pin) =>{
    const re= /^[0-9]{2,30}$/;
    return re.test(pin)
}

export const validateAge = (age) =>{
    const re= /^[0-9]{2}$/;
    return re.test(age)
}

export const validateWorkHours= (hours) =>{
    const re = /^[0-9]{1,2}$/;
    return re.test(hours)
}
export const validatePhoneNumber= (phone_number) =>{
    const re = /^03[0-4]{2}\d{7}$/;
    return re.test(phone_number)
}
