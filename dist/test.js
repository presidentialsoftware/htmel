var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// src/test.ts
import { WebServer, Middleware, Route, ParseBody } from "./server";
let UserAPI = class UserAPI {
    getUsers(req, res) {
        res.end(JSON.stringify([{ id: 1, name: "John Doe" }]));
        // test
        // curl -X POST http://localhost:4000/users
    }
    createUser(req, res) {
        res.end(req.body);
    }
};
__decorate([
    Route("GET", "/users"),
    Middleware((req, res) => {
        res.setHeader("Content-Type", "application/json");
    })
], UserAPI.prototype, "getUsers", null);
__decorate([
    Route("POST", "/users"),
    ParseBody()
], UserAPI.prototype, "createUser", null);
UserAPI = __decorate([
    WebServer({ port: 4000 })
], UserAPI);
const server = new UserAPI();
