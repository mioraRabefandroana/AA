# Generated by Django 3.2.9 on 2021-12-20 23:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_auto_20211212_2143'),
    ]

    operations = [
        migrations.AddField(
            model_name='content',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='publication/'),
        ),
    ]