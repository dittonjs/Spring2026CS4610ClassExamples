import express from 'express';
import { engine } from 'express-handlebars';

const app = express();
const PORT = 3000;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
