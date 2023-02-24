export { };

declare global {
    namespace Express {
        interface Request {
            user: (UserIface & { _id: ObjectId; }) | null;
        }
    }
}
