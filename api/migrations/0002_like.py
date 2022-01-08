# Generated by Django 3.2.9 on 2022-01-08 17:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('aaUser', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.aauser')),
                ('publication', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.publication')),
            ],
        ),
    ]