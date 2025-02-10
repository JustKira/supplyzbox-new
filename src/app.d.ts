// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Client as MinioClient } from 'minio';
import type Surreal from 'surrealdb';

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			surreal: Surreal;
			minio: MinioClient;
		}
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
