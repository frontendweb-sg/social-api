import bcrypt from 'bcryptjs';

export class Password {
	static hash(password: string) {
		return bcrypt.hashSync(password, 12);
	}
	static compare(password: string, hash: string) {
		return bcrypt.compareSync(password, hash);
	}
}
