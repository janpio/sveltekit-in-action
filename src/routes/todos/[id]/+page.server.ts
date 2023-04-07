import { error, redirect } from '@sveltejs/kit';
import { isAuthenticated } from '$lib/auth';
import type { Todo } from '@prisma/client';
import type { Actions, PageServerLoad } from './$types';
import { parseFormData } from '$lib/validation';
import { deleteTodoFormData } from '$lib/validation/todos';

const url = '/api/todos';

export const load: PageServerLoad = (async ({ fetch, locals, params }) => {
  await isAuthenticated(locals);

  const response = await fetch(`${url}/${params.id}`);
  const data: Todo | Error = await response.json();

  if (!response.ok) {
    throw error(response.status, { message: (data as Error).message });
  }

  return { todo: data as Todo };
});

export const actions: Actions = {
  delete: async ({ fetch, locals, request }) => {
    await isAuthenticated(locals);

    const { todoId } = await parseFormData(request, deleteTodoFormData);

    await fetch(`${url}/${todoId}`, { method: 'DELETE' });

    throw redirect(302, '/todos');
  }
};
