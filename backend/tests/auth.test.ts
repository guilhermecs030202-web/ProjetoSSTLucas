import request from "supertest";
import { app } from "../src/app";
import { AppDataSource } from "../src/config/data-source";
import bcrypt from "bcryptjs";

// Mock the AppDataSource
jest.mock("../src/config/data-source", () => {
    return {
        AppDataSource: {
            getRepository: jest.fn()
        }
    };
});

describe("Auth Controller & API Endpoints", () => {
    let mockRepository: any;

    beforeEach(() => {
        mockRepository = {
            findOne: jest.fn(),
            save: jest.fn()
        };
        (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/auth/login", () => {
        it("should return 200 and user info (without password) on valid credentials", async () => {
            const password = "mysecretpassword";
            const hashedSenha = await bcrypt.hash(password, 10);
            const mockUser = {
                idUsuario: "user-uuid-1234",
                login: "testuser",
                email: "test@example.com",
                senha: hashedSenha
            };

            mockRepository.findOne.mockResolvedValue(mockUser);

            const res = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "test@example.com",
                    password: password
                });

            expect(res.status).toBe(200);
            expect(res.body.message).toContain("sucesso");
            expect(res.body.user).toBeDefined();
            expect(res.body.user.idUsuario).toBe("user-uuid-1234");
            expect(res.body.user.login).toBe("testuser");
            expect(res.body.user.email).toBe("test@example.com");
            expect(res.body.user.senha).toBeUndefined(); // Verify password is NOT exposed
        });

        it("should return 401 when user is not found", async () => {
            mockRepository.findOne.mockResolvedValue(null);

            const res = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "nonexistent@example.com",
                    password: "password123"
                });

            expect(res.status).toBe(401);
            expect(res.body.message).toContain("incorretos");
        });

        it("should return 401 when password is incorrect", async () => {
            const hashedSenha = await bcrypt.hash("correctpassword", 10);
            const mockUser = {
                idUsuario: "user-uuid-1234",
                login: "testuser",
                email: "test@example.com",
                senha: hashedSenha
            };

            mockRepository.findOne.mockResolvedValue(mockUser);

            const res = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "test@example.com",
                    password: "wrongpassword"
                });

            expect(res.status).toBe(401);
            expect(res.body.message).toContain("incorretos");
        });

        it("should return 400 when email or password is missing in request", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "test@example.com"
                });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Validation failed");
        });
    });

    describe("POST /api/auth/change-credentials", () => {
        it("should successfully update credentials and return 200", async () => {
            const currentPassword = "oldpassword";
            const hashedSenha = await bcrypt.hash(currentPassword, 10);
            const mockUser = {
                idUsuario: "user-uuid-1234",
                login: "testuser",
                email: "test@example.com",
                senha: hashedSenha
            };

            mockRepository.findOne.mockResolvedValue(mockUser);
            mockRepository.save.mockResolvedValue({
                ...mockUser,
                email: "new@example.com",
                login: "new"
            });

            const res = await request(app)
                .post("/api/auth/change-credentials")
                .send({
                    currentEmail: "test@example.com",
                    currentPassword: currentPassword,
                    newEmail: "new@example.com",
                    newPassword: "newpassword123"
                });

            expect(res.status).toBe(200);
            expect(res.body.message).toContain("sucesso");
            expect(mockRepository.save).toHaveBeenCalled();
            
            const savedUser = mockRepository.save.mock.calls[0][0];
            expect(savedUser.email).toBe("new@example.com");
            expect(savedUser.login).toBe("new");
            const isMatch = await bcrypt.compare("newpassword123", savedUser.senha);
            expect(isMatch).toBe(true);
        });

        it("should return 400 when current password is wrong", async () => {
            const hashedSenha = await bcrypt.hash("correctpassword", 10);
            const mockUser = {
                idUsuario: "user-uuid-1234",
                login: "testuser",
                email: "test@example.com",
                senha: hashedSenha
            };

            mockRepository.findOne.mockResolvedValue(mockUser);

            const res = await request(app)
                .post("/api/auth/change-credentials")
                .send({
                    currentEmail: "test@example.com",
                    currentPassword: "wrongpassword",
                    newEmail: "new@example.com",
                    newPassword: "newpassword123"
                });

            expect(res.status).toBe(400);
            expect(res.body.message).toContain("incorretos");
            expect(mockRepository.save).not.toHaveBeenCalled();
        });
    });
});
