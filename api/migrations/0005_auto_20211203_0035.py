# Generated by Django 3.2.9 on 2021-12-03 00:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_auto_20211203_0008'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fan',
            name='badges',
            field=models.ManyToManyField(blank=True, null=True, to='api.BadgeFan'),
        ),
        migrations.AlterField(
            model_name='fan',
            name='biographie',
            field=models.TextField(blank=True, null=True),
        ),
    ]
