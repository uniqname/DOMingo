import jsdom from 'jsdom';

const html = `<body>
    <h1>{{title}}</h1>
    <h2>{{user.falsy}}</h2>
    <section>
        <p>Welcome {{ user.username }}</p>
        <img src="{{ user/profile_pic}}" />

        <p>Likes</p>
        <ul>
            <li>{{ user.likes.0 }}</li>
            <li>{{user.likes.1}}</li>
            <li>{{user.likes.2}}</li>
            <li>{{ user.likes.3 }}</li>
        </ul>
        <q>$:custom.binding:$</q>
    </section>
</body>`;

export default () => jsdom.jsdom(html).defaultView;
