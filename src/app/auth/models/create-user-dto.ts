export class CreateUserDto {
    name: string;
    lastname: string;
    dni: string;
    address: string;
    username: string;
    email: string;
    password: string;


    constructor(name: string, lastname: string, dni: string, address: string, username: string, email: string, password: string) {
        this.name = name;
        this.lastname = lastname;
        this.dni = dni;
        this.address = address;
        this.username = username;
        this.email = email;
        this.password = password;
    }
}
