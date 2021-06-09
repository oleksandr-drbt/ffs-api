import * as Knex from 'knex';
import { v4 as uuid } from 'uuid';
import PasswordService from '../../services/PasswordService';

export async function seed(knex: Knex): Promise<any> {
  return knex('users').insert([
    {
      id: uuid(),
      first_name: 'Aleksandr',
      last_name: 'Drobot',
      email: 'alex.drobot22@gmail.com',
      role: 'student',
      phone: '+380665538975',
      position: 'Middle Full-stack Developer',
      // tslint:disable-next-line:max-line-length
      description: 'I\'m a student of KhNUE. I work in NIX Solutions as a Middle Full-stack Developer.' +
        ' When I discovered coding when I was 13, I didn’t even know it was coding.' +
        ' I was using HTML tags inside a game forum to embed images, links, and videos I thought was cool.' +
        ' That lead me into learning web design and using HTML and CSS to create websites.' +
        ' What really helped me get the position was knowing how to code in HTML and CSS,' +
        ' something not all designers knew. Then, I caught the coding bug and went on to teach myself' +
        ' JavaScript, Ruby, Java, Python, etc. Combined with my computer science classes,' +
        ' I was able to pass multiple coding interviews to land a software engineering internship at Nix.',
      password: await PasswordService.hashPassword('123456'),
    },
    {
      id: uuid(),
      first_name: 'Igor',
      last_name: 'Mishenko',
      email: 'igor@ffs.com',
      role: 'student',
      phone: '+380985513095',
      position: 'Back-end Developer',
      description: 'I\'m a student of KhNUE. I work in NIX Solutions as a Back-end Developer.',
      password: await PasswordService.hashPassword('123456'),
    },
    {
      id: uuid(),
      first_name: 'Bohdan',
      last_name: 'Onishenko',
      email: 'bohdan@ffs.com',
      role: 'teacher',
      phone: '+380931538305',
      position: 'OOP teacher',
      description: 'I\'m a teacher of KhNUE. I\'ve been teaching Object-Oriented Programing for 10 years.',
      password: await PasswordService.hashPassword('123456'),
    },
    {
      id: uuid(),
      first_name: 'Vlad',
      last_name: 'Ignatov',
      email: 'vlad@ffs.com',
      role: 'teacher',
      phone: '+380651888711',
      position: 'teacher of DB modeling',
      description: 'I\'m a teacher of KhNUE. I\'ve been teaching Data Base Modeling for 8 years.',
      password: await PasswordService.hashPassword('123456'),
    },
  ]);
}
