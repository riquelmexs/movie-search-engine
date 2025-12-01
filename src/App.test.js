import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';

jest.mock('axios');

const mockMovies = [
  {
    id: 1,
    title: 'Inception',
    overview: 'Um ladrão que rouba segredos através da invasão dos sonhos.',
    poster_path: '/inception.jpg',
  },
  {
    id: 2,
    title: 'The Matrix',
    overview: 'Um hacker descobre a verdade sobre a sua realidade.',
    poster_path: '/matrix.jpg',
  },
];

describe('App - Buscador de Filmes', () => {
  beforeEach(() => {
    axios.get.mockReset();
  });

  test('renderiza o título da aplicação', async () => {
    axios.get.mockResolvedValueOnce({ data: { results: [] } });

    render(<App />);

    const title = await screen.findByText(/Buscador de Filmes/i);
    expect(title).toBeInTheDocument();
  });

  test('renderiza o input de busca e o botão', async () => {
    axios.get.mockResolvedValueOnce({ data: { results: [] } });

    render(<App />);

    const input = await screen.findByPlaceholderText(/Digite o nome do filme/i);
    const button = screen.getByRole('button', { name: /Buscar Filmes/i });

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test('chama a API ao buscar um filme digitado pelo usuário', async () => {
    // 1ª chamada: useEffect (Inception)
    axios.get.mockResolvedValueOnce({ data: { results: [] } });
    // 2ª chamada: busca manual
    axios.get.mockResolvedValueOnce({ data: { results: mockMovies } });

    render(<App />);

    const input = await screen.findByPlaceholderText(/Digite o nome do filme/i);
    const button = screen.getByRole('button', { name: /Buscar Filmes/i });

    fireEvent.change(input, { target: { value: 'Matrix' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(2);
    });

    const lastCallUrl = axios.get.mock.calls[1][0];
    expect(lastCallUrl).toContain('/search/movie');
    expect(lastCallUrl).toContain('query=Matrix');
  });

  test('exibe os cards de filmes retornados pela API', async () => {
    axios.get.mockResolvedValueOnce({ data: { results: mockMovies } });

    render(<App />);

    const firstMovie = await screen.findByText(/Inception/i);
    const secondMovie = await screen.findByText(/The Matrix/i);

    expect(firstMovie).toBeInTheDocument();
    expect(secondMovie).toBeInTheDocument();
  });

  test('exibe mensagem de erro quando a API falha', async () => {
    axios.get.mockRejectedValueOnce(new Error('Erro na API'));

    render(<App />);

    const errorMessage = await screen.findByText(/Erro ao buscar filmes./i);
    expect(errorMessage).toBeInTheDocument();
  });
});
