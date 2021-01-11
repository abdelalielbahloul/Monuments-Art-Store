# Awesome Project Build with TypeORM
> Monuments Art Store an online platform used to purchase High-Quality Art Images of the most popular monuments around the world, developed with typeORM and express in backend. Angular as frontend framework

## Installation && Setup Steps to run this project:

1. Run `cd monument-art-store/src` Run `npm i` command
2. Setup database settings inside `ormconfig.json` file
3. Re-name `.env.example` to `.env` 
4. Run `npm start` command to start the backend server.
```
Migrations are disabled for this project by default and each change in the entities will automaticaly applied to the database when server restarted.
```
take a see : [migrations](https://typeorm.io/#/migrations)


5. To start the frontend project check that the angular cli is globaly installed in your machine or run this command `npm i -g @angular/cli`
6. Run `cd clientApp` check if your are in the root folder!
7. Run `ng serve` | `ng s` and tape `http://localhost:4200` in your navigator or run `ng s -o` the project will run in the development mode on `http://localhost:4200/`


## Documentation
To see the APIs documentations use `http://localhost:{PORT}/swagger`
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
MIT License 
[MIT](https://github.com/abdelalielbahloul/Monuments-Art-Store/blob/master/monument-art-store/LICENSE/)


