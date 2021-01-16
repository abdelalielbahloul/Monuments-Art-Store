export interface User {
    _id:	string;
    name:	string;
    email:	string;
    image:	string;
    role:	{
        id: number,
        name: string
    }
    contributions:	number;
    createdAt:	string;
    updatedAt:	string;
}
