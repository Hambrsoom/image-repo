export const PrimaryGeneratedColumn = jest.fn();
export const Column = jest.fn();
export const Entity = jest.fn();
export const CreateDateColumn = jest.fn();
export const UpdateDateColumn = jest.fn();
export const Unique = jest.fn();

export const getRepository = jest.fn().mockReturnValue({
    findOne: jest.fn(), // return value will be set in the test
    getMany: jest.fn()
});

export const createRepository = jest.fn().mockReturnValue({
    findOne: jest.fn(), // return value will be set in the test
     getMany: jest.fn()
});

export const ManyToOne = jest.fn(callback => callback());
export const ManyToMany = jest.fn(callback => callback());
export const OneToOne = jest.fn(callback => callback());
export const OneToMany = jest.fn(callback => callback());
export const JoinColumn = jest.fn(callback =>{});
export const IsUsernameAlreadyExist = jest.fn(callback => {});
